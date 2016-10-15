'use strict';

module.exports = function (User) {
	var q = require('q');
	var _ = require('lodash');
	var jsesc = require('jsesc');
	
	User.sendLog = function (title, error, file) {
		var errorDescription, fileString;
		try {
			if (error != null) {
				errorDescription = JSON.stringify(error);
			} else {
				errorDescription = '';
			}
			
			if (file != null) {
				fileString = JSON.stringify(file);
			} else {
				fileString = '{}';
			}
			
			var newString = ' { "error":' + errorDescription + ' , "file" :' + fileString + '}';
			var webhookUri = "https://hooks.slack.com/services/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";
			
			var slack = new Slack();
			slack.setWebhook(webhookUri);
			
			slack.webhook({
				channel: "#api_errors",
				username: title,
				text: newString
			}, function (err, response) {
				console.log('----error al enviar log----')
			});
		} catch (e) {
			console.log('----error al enviar log----')
		}
	};
	
	
	User.saveProfile = function (idProvider, token, user) {
		var Place = app.models.Place;
		var defer = q.defer();
		var FB = require('facebook-node');
		FB.setAccessToken(token);
		
		FB.api('me', {fields: 'tagged_places,id,name', access_token: token}, function (res) {
			if (!res || res.error) {
				console.log('error validando la wea');
				defer.reject(res.error);
			}
			Place.savePlaces(res.tagged_places.data).then(function (places) {
				console.log('resolvio save places');
				// console.log(res);
				var promises = Place.createPromisesPlacesData(places);
				q.all(promises).then(function (userPlaces) {
					console.log('terminaron todas');
					var descriptionText = ' ';
					var categoriesString = ' ';
					_.forEach(userPlaces, function (place, index) {
						descriptionText = descriptionText + place.description;
						categoriesString = categoriesString != ' ' ? (categoriesString + ' , ' + place.categoriesString) : place.categoriesString;
						categoriesString.replace('/', ' ').replace('\n', ' ');
						if (index == userPlaces.length - 1) {
							console.log(categoriesString);
							// console.log('descText',descriptionText);
							alchemy(categoriesString).then(function (res) {
								console.log('concepts', res.concepts);
								user.concepts = res.concepts;
								user.save(function (err, user) {
									if (err) {
										defer.reject(err);
									} else {
										defer.resolve(user);
									}
								});
							}, function (err) {
								console.log('errors alc', err);
							})
						}
					})
					
					
				});
			}, function (err) {
				defer.reject(err);
			})
		});
		
		return defer.promise;
	};
	
	function alchemy(text) {
		
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
				console.log('error alc', err);
				console.log(':', text);
				defer.reject(err);
			} else {
				console.log(response);
				defer.resolve(response);
			}
		});
		return defer.promise;
	};
	
	
	User.register = function (name, email, idProvider, token, req, cb) {
		var FB = require('facebook-node');
		FB.setAccessToken(token);
		
		
		// SE VALIDA TOKEN DE FB
		User.validarTokenFacebook(idProvider, token).then(function (response) {
			console.log('valida token');
			// COMPROBAMOS SI EL user ESTÁ REGISTRADO
			User.findOne({where: {idProvider: idProvider}}, function (err, user) {
				if (!err && user != null) {
					console.log('encontro user');
					user.userId = user.id;
					cb(null, user);
					return;
				} else {
					console.log('user no registrado');
					if (!name || !email || !idProvider || !token) {
						var error = new Error();
						error.statusCode = 418;
						error.message = 'datos invalidos';
						error.code = 'Precondition_Required';
						cb(error);
						return;
					}
					
					// SI user NO ESTÁ REGISTRADO, SE REALIZA CON EL REGISTRO
					
					var requestIp = require('request-ip');
					var clientIp;
					try {
						clientIp = requestIp.getClientIp(req);
					} catch (e) {
						clientIp = '0.0.0.0';
						try {
							User.sendLog('user_CATCH_GET_IP', e, 'error obteniendo ip');
						} catch (error_log) {
							console.log('---error enviando log----', error_log);
						}
					}
					
					
					User.doRegisterRegular(name, email, idProvider, token, req).then(function (response) {
						
						User.saveProfile(idProvider, token, user).then(function (res) {
							console.log(res);
							cb(null, res);
							return;
						}, function (err) {
							console.log(err);
							cb(err);
							return;
						});
						console.log('----registro exitosanente ----');
						console.log(response);
						cb(null, response);
						
						// console.log('-----');
						
					}, function (err) {
						try {
							User.sendLog('USUA_REG_Captcha', err, 'error en captcha');
						} catch (error_log) {
							console.log('---error enviando log----', error_log);
						}
						cb(err);
						return;
					})
					
					
				}
			});
		}, function (err) {
			cb(err);
			return;
		});
	};
	
	
	User.doRegisterRegular = function (name, email, idProvider, token, req) {
		console.log('llego al register regular');
		
		var deferred = q.defer();
		
		var user = {
			name: name,
			email: email,
			idProvider: idProvider,
			created: new Date()
		};
		user.password = idProvider;
		User.create(
			user
			, function (err, user) {
				if (err) {
					try {
						User.sendLog('USUA_DoRegisterRegular_CreateUser', err, 'error creando user luego de checkear ip');
					} catch (error_log) {
						console.log('---error enviando log----', error_log);
					}
					deferred.reject(err);
					return deferred.promise;
				} else {
					user.userId = user.id;
					deferred.resolve(user);
					return deferred.promise;
				}
			});
		
		
		return deferred.promise;
	};
	
	User.remoteMethod(
		'register',
		{
			accepts: [
				{arg: 'name', type: 'string'},
				{arg: 'email', type: 'string'},
				{arg: 'idProvider', type: 'string'},
				{arg: 'token', type: 'string'},
				{arg: 'req', type: 'object', http: {source: 'req'}}
			
			],
			http: {path: '/register', verb: 'post'},
			returns: {arg: 'response', type: 'object'}
		}
	);
	
	
	User.validarTokenFacebook = function (id, token) {
		
		var deferred = q.defer();
		
		//
		try {
			var FB = require('facebook-node');
			
			FB.setAccessToken(token);
			
			// deferred.resolve({'exito':true});
			
			FB.api(id, function (res) {
				if (!res || res.error) {
					try {
						User.sendLog('USUA_ValidTokFace', res.error, 'error validando token');
						deferred.reject({'error': 'error al validar user fb'});
					} catch (error_log) {
						deferred.reject({'error': 'error al validar user fb'});
						console.log('---error enviando log----', error_log);
					}
					deferred.reject(res.error);
				} else {
					if (res.id == id) {
						console.log('id  coincide');
						
						deferred.resolve(res);
					} else {
						console.log('id no coincide');
						deferred.reject({'error': 'error al validar user fb'});
					}
				}
			});
		} catch (e) {
			try {
				User.sendLog('USUA_cATCH_ValidTokFb', e, 'error validando token');
			} catch (error_log) {
				console.log('---error enviando log----', error_log);
			}
			deferred.reject(e);
			
		}
		return deferred.promise;
	};
	
	User.createPromisesPlacesData = function (places) {
		var Place = app.models.Place;
		var arrayPromises = [];
		_.forEach(places, function (place, index) {
			arrayPromises.push(Place.getPlace(place));
		});
		return arrayPromises;
	};
	
	User.observe('before save', function (ctx, next) {
		if (ctx.instance) {
			ctx.instance.updated = new Date();
		} else {
			ctx.data.updated = new Date();
		}
		next();
	});
	
	User.me = function (req, cb) {
		var currentUser = req.currentUser;
		
		cb(null, req.accessToken, currentUser);
	};
	
	User.remoteMethod(
		'me',
		{
			accepts: [
				{arg: 'req', type: 'object', http: {source: 'req'}}
			],
			http: {path: '/me', verb: 'get'},
			returns: [
				{arg: 'access_token', type: 'object'},
				{arg: 'me', type: 'object'}]
		}
	);
	
	User.refreshToken = function (token, ttl, req, cb) {
		if (token) {
			app.models.Token.findOne({
				token: token
			}, function (err, actoken) {
				if (err) {
					cb({
						statusCode: 500,
						message: err
					})
				} else {
					if (actoken) {
						app.models.AccessToken.create({
							userId: actoken.userId,
							ttl: ttl || (60 * 60 * 24 * 7 * 2)
						}, function (err, newToken) {
							cb(null, newToken);
							app.models.Token.destroyById(actoken.id, function (err) {
							});
							
						});
					} else {
						cb({
							statusCode: 404,
							message: 'Token no encontrado'
						})
					}
				}
				
			});
		} else {
			cb({
				statusCode: 500,
				message: 'Token requerido'
			})
		}
		
	};
	
	User.remoteMethod(
		'refreshToken',
		{
			accepts: [
				{arg: 'token', type: 'string', required: true},
				{arg: 'ttl', type: 'number'},
				{arg: 'req', type: 'object', http: {source: 'req'}}
			],
			http: {path: '/refreshToken', verb: 'post'},
			returns: [
				{arg: 'access_token', type: 'object'}]
		}
	);
	
	
	// User.disableRemoteMethod("create", true);
	User.disableRemoteMethod("upsert", true);
	User.disableRemoteMethod("updateAll", true);
	User.disableRemoteMethod("updateAttributes", false);
	
	User.disableRemoteMethod("findById", true);
	User.disableRemoteMethod("findOne", true);
	
	User.disableRemoteMethod("deleteById", true);
	
	User.disableRemoteMethod("confirm", true);
	User.disableRemoteMethod("count", true);
	User.disableRemoteMethod("exists", true);
	
	User.disableRemoteMethod('__count__accessTokens', false);
	User.disableRemoteMethod('__create__accessTokens', false);
	User.disableRemoteMethod('__delete__accessTokens', false);
	User.disableRemoteMethod('__destroyById__accessTokens', false);
	User.disableRemoteMethod('__findById__accessTokens', false);
	User.disableRemoteMethod('__get__accessTokens', false);
	User.disableRemoteMethod('__updateById__accessTokens', false);
	User.disableRemoteMethod('__updateById__publicaciones', false);
};
