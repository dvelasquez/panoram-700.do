'use strict';

angular.module('request.factory', [])
	.factory('$request', function( $q, $timeout, $cordovaSpinnerDialog, $log, $localStorage ) {
		
		var progress = false;
		var request = [];
		
		String.prototype.hashCode = function() {
			var hash = 0, i, chr, len;
			if(this.length === 0) return hash;
			for(i = 0, len = this.length; i < len; i++){
				chr = this.charCodeAt(i);
				hash = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		};
		
		return function( model, method ) {
			var defer = $q.defer();
			var progressInner = false;
			var args = Array.prototype.slice.call(arguments).slice(2);
			
			if(!model){
				defer.reject();
				throw 'Model not defined';
			}
			
			var injector = angular.injector(['ng', 'lbServices']);
			var greeter = injector.get(model);
			
			var g = Function.prototype.bind.call(greeter[method], greeter);
			$log.debug(args);
			var req = g.apply(greeter[method], args);
			$timeout(function() {
				try{
					if(!args){
						args = 'request';
					}
					var jsonArgs = angular.toJson(args).hashCode();
					var nameLocalStorage = model + '.' + method + '.' + jsonArgs;
					var modelSaved = $localStorage.getItem(nameLocalStorage);
					if(modelSaved){
						defer.notify(modelSaved);
					} else {
						if(!progress && window.plugins && window.plugins.spinnerDialog){
							$cordovaSpinnerDialog.show('Actualizando', null, true);
							progress = true;
							progressInner = true;
						}
					}
					if(_.findIndex(request, {
							index: nameLocalStorage
						}) < 0){
						request.push({
							index: nameLocalStorage,
							promise: defer.promise
						});
						req.$promise.then(res => {
							$localStorage.setItem(nameLocalStorage, res);
							defer.notify(res);
							defer.resolve(res);
						}, err => {
							$log.error('Reject: ', err);
							defer.reject(err);
						}).finally(() => {
							if(progress && window.plugins && window.plugins.spinnerDialog && progressInner){
								$cordovaSpinnerDialog.hide();
								progress = false;
							}
							request = _.remove(request, function( value ) {
								return value.index === nameLocalStorage;
							});
						});
					} else {
						var r = _.find(request, {
							index: nameLocalStorage
						});
						return r.promise;
					}
				} catch(e){
					defer.reject(e);
					$log.debug('Catch: ', e);
				}
			}, 250);
			/* Pequeño delay */
			
			return defer.promise;
		};
	});
