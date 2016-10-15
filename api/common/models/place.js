'use strict';

module.exports = function(Place) {
	
	var _ = require('lodash');
	var q = require('q');
	var watson = require('watson-developer-cloud');
	var jsesc = require('jsesc');
	
	Place.savePlaces = function (tagged_places) {
		var defer = q.defer();
		var Place = app.models.place;
		var placesArray = [];
		
		_.forEach(tagged_places, function (data, index) {
			var place = data.place;
			place.fbId = place.id;
			delete place.id;
			
			Place.findOne({where: {fbId: place.fbId}}, function (err, placeFound) {
				
				if (!err && (placeFound != null)) {
					// console.log('lugar existe');
					placesArray.push(placeFound);
					
					if (index == tagged_places.length - 1) {
						defer.resolve(placesArray);
					}
					
				} else {
					console.log('lugar no existe', place.name);
					var newLocation = {
						lat: place.location.latitude,
						lng: place.location.longitude
					};
					place.location = newLocation;
					Place.create(place, function (err, placeCreated) {
						// console.log('creo lugar', placeCreated);
						if (err) {
							console.log(err);
							if (index == tagged_places.length - 1) {
								defer.resolve(placesArray);
							}
						} else {
							placesArray.push(placeCreated);
							if (index == tagged_places.length - 1) {
								defer.resolve(placesArray);
							}
						}
					});
				}
			});
		});
		
		return defer.promise;
	};
	
	Place.createPromisesPlacesData = function (places) {
		var arrayPromises = [];
		_.forEach(places, function (place, index) {
			arrayPromises.push(Place.getPlace(place));
		});
		return arrayPromises;
	};
	
	Place.alchemy = function (text) {
		
		var defer = q.defer();
		var alchemy_language = watson.alchemy_language({
			api_key: 'd445c9cb6f230301454f660d60a1d1678b6ca024'
		});
		
		var parameters = {
			maxRetrieve: 20,
			sourceText : 'cleaned_or_raw',
			html: text
		};
		
		alchemy_language.concepts(parameters, function (err, response) {
			if (err) {
				console.log('error alc',err);
				console.log(':',text);
				defer.reject(err);
			} else {
				defer.resolve(response);
			}
		});
		return defer.promise;
	};
	
	
	Place.getPlace = function (place) {
		var FB = require('facebook-node');
		FB.setAccessToken('949335795196098|vtc4SfWmrpTuC2Ve9hVOcNc85P0');
		
		var defer = q.defer();
		if (place.profiled) {
			defer.resolve(place);
			return defer.promise;
		}
		
		FB.api(place.fbId, {fields: ['place_type', 'name', 'place_topics.limit(10)', 'category', 'category_list', 'description'], locale: 'es_CL'}, function (res) {
				console.log('res api', res);
				if (!res || res.error) {
					console.log('error obteniendo info lugar', res.error);
					defer.reject(res.error);
				} else {
					
					place.mainCategory = res.category.replace('/',' ').replace('\n',' ');
					var categoryList = [];
					var categoriesString = res.description ? res.description.replace('\n',' ') + ' ' + res.category.replace('/',' ').replace('\n',' ') : res.category.replace('/',' ').replace('\n',' ');
					_.forEach(res.category_list, function (category, index) {
						categoriesString = categoriesString + ', ' + category.name.replace('/',' ').replace('\n',' ');
						categoryList.push(category.name.replace('\n',' '));
					});
					place.categoriesString = categoriesString;
					console.log('cat string ' ,categoriesString);
					place.description = (res.description ? res.description : '');
					place.categories = categoryList;
					place.profiled = true;
					console.log('place updated', place);
					// SE OBTIENE PERSONALIDAD DEL LUGAR
					Place.alchemy(categoriesString).then(function (response) {
							place.concepts = response.concepts;
							Place.checkConcepts(place.concepts).then(function (res) {
								place.save(function (err, obj) {
									defer.resolve(obj);
								});
							}, function (err) {
								place.save(function (err, obj) {
									defer.resolve(obj);
								});
							});
						}, function (err) {
							place.save(function (err, obj) {
								defer.resolve(obj);
							});
						}
					);
				}
			}
		)
		;
		
		
		return defer.promise;
	}
	;
	
	
	Place.checkConcepts = function (conceptsArray) {
		var Category = app.models.Category;
		var defer = q.defer();
		
		if (conceptsArray.length == 0) {
			defer.resolve();
			return defer.promise;
		} else {
			_.forEach(conceptsArray, function (concept, index) {
				
				Category.findOrCreate({where: {name: concept.text}}, {name: concept.text, type : [' ']}, function (err, categoryFoC) {
					if (err) {
						console.log('error creando concept', err);
					}
					if (index == (conceptsArray.length - 1)) {
						console.log('termino de revisar conceptos');
						defer.resolve('termino concepts');
					}
				});
			});
		}
		
		
		return defer.promise;
	};
	
	
};
