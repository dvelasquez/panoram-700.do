'use strict';

angular.module('decorator.module')
	.config($httpProvider => {
		$httpProvider.interceptors.push(['$injector', '$q', '$log', '$toast', ( $injector, $q, $log, $toast ) => {
			return {
				'responseError': rejection => {
					var error = 'API UNKNOWN';
					var status = [500, 401, -1];
					rejection.handled = false;
					if(status.indexOf(rejection.status) >= 0){
						rejection.handled = true;
						if(rejection.status === 500){
							error = 'API_500';
							$log.error('Error de servidor', ' El servidor no entrega una respuesta (' + error + ' ' + rejection.statusText + ')');
							$toast.error('Error de servidor', ' El servidor no entrega una respuesta (' + error + ' ' + rejection.statusText + ')');
						}
						if(rejection.status === -1){
							error = 'API_CONNECTION_REFUSED';
							$log.error('Error de servidor', ' Conexión rechazada (' + error + ' ' + rejection.statusText + ')');
							$toast.error('Error de servidor', ' Conexión rechazada (' + error + ' ' + rejection.statusText + ')');
						}
						if(rejection.status === 401){
							var defer = $q.defer();
							var $auth = $injector.get('$auth');
							$log.debug(rejection);
							if($auth.isLogued() && !rejection.config.resended){
								$log.debug('Renovando TOKEN, 401');
								rejection.config.resended = true;
								$auth.refreshToken()
									.then(function() {
										$injector.get('$http')(rejection.config)
											.then(
												resp => {
													defer.resolve(resp);
												},
												err => {
													defer.reject(err);
												});
									})
									.catch( err => {
										defer.reject(err);
									} );
								
								return defer.promise;
							}
						}
					}
					return $q.reject(rejection);
				}
			};
		}]);
	});
