'use strict';

module.exports = function( app ) {
	var AccessToken = app.models.AccessToken;
	var Token = app.models.Token;
	AccessToken.observe('before delete', function( ctx, next ) {
		if(ctx.instance && ctx.instance.__data){
			var data = ctx.instance.__data;
			Token.create({
				token: data.id,
				userId: data.userId
			}, function( err, created ) {
				if(err){
					next(err);
				} else {
					next();
				}
			});
		} else {
			next();
		}
	});
};
