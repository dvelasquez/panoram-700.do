'use strict';

/* global facebookConnectPlugin */

angular.module('facebook.provider', [])
	.provider('$facebook', () => {
		
		var permissions = [];
		
		
		function setPermission( permission ) {
			permissions = permission;
		}
		
		function addPermission( permission ) {
			if(!angular.isArray(permission)){
				permissions.push(permission);
			} else{
				permissions = permissions.concat(permission);
			}
			permissions = _.uniq(permissions);
		}
		
		function checkPlugin() {
			try{
				return angular.isDefined(facebookConnectPlugin);
			} catch(e){
				return false;
			}
		}
		
		return {
			setPermission: setPermission,
			addPermission: addPermission,
			$get: ( $q, $toast, $log ) => {
				function login() {
					var defer = $q.defer();
					if(checkPlugin()){
						facebookConnectPlugin.login(
							permissions,
							res => {
								facebookConnectPlugin.api(res.authResponse.userID + '/?fields=id,name,about,email,birthday', permissions,
									me => {
										me.authResponse = res.authResponse;
										defer.resolve(me);
										$log.debug(me);
									},
									err => {
										defer.reject(err);
									});
								
							},
							err => {
								$toast.error('Facebook', 'No se logró conectar con Facebook (FACEBOOK_SDK_LOGIN)');
								$log.error(err);
								defer.reject('No se logró conectar con Facebook');
							});
					} else{
						$toast.error('Facebook', 'No se logró iniciar Facebook (FACEBOOK_SDK_PLUGIN)');
						defer.reject('No se logró iniciar Facebook');
					}
					return defer.promise;
				}
				
				return {
					login: login,
					register: login
				};
			}
		};
	});
