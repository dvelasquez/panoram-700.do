'use strict';

module.exports = function(Concept) {
	
	
	
	Concept.observe('before save', function(ctx, next){
		var app = ctx.Model.app;
		
		//Apply this hooks for save operation only..
		if(ctx.isNewInstance){
			//suppose my datasource name is mongodb
			var mongoConnector = app.dataSources.mongoIbm.connector;
			mongoConnector.collection("counter").findAndModify({collection: 'concept'}, [['_id','asc']], {$inc: { value: 1 }}, {new: true}, function(err, sequence) {
				if(err) {
					throw err;
				} else {
					// Do what I need to do with new incremented value sequence.value
					//Save the tweet id with autoincrement..
					ctx.instance.index = sequence.value.value;
					next();
				} //else
			});
		} //ctx.isNewInstance
		else {
			next();
		}



	});
	

};
