'use strict';
var app = require('../../server/server');
var _ = require('lodash');

module.exports = function (Type) {

    Type.getFilteredActivities = function getFilteredActivities(req, cb) {
        Type.find({where: {name: {regexp:req.type}}, include: ['categories']}
            , function (err, typesAndCategories) {
                if (err) {
                    cb(err, null);
                }
                if(typesAndCategories.length === 0){
                    cb(null, []);
                }

                var Activity = app.models.activity;

                var categories = [];
                _.forEach(_.first(typesAndCategories).__data.categories, function(cat){
                    categories.push(cat.name);
                });
                Activity.find({where:{categories:{inq:categories}}, include:"place"}, function(err, activities){
                    if(err){cb(err, null);}
                    console.log(activities);
                    cb(null, activities);
                });

            });
    };

    Type.remoteMethod('getFilteredActivities', {
        accepts: [{arg: 'req', type: 'object', http: {source: 'body'}}],
        returns: {arg: 'activities', type: 'object'},
        http: {verb: 'post'}
    });

};
