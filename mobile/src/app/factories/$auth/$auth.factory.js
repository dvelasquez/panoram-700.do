'use strict';

angular.module('auth.factory', [])
	.factory('$auth', function( $q, $log, $toast, $state, $rootScope, $localStorage, $ionicHistory, User, LoopBackAuth, SERVER ) {
		
		/* Authorization */
		
		function login( username, password ) {
			var defer = $q.defer();
			
			User.login({
				username: username,
				password: password,
				ttl: SERVER.ttl
			}).$promise
				.then(() => {
					me(true)
						.then(res => {
							$state.home();
							defer.resolve(res);
						})
						.catch(err => {
							$toast.error('Problema al obtener el usuario', 'No es posible obtener el usuario');
							defer.reject(err);
						});
				})
				.catch(err => {
					if(!err.handled){
						if(err.status === 401){
							$toast.error('Credenciales erróneas', 'Error de Usuario o Contraseña (API_AUTH_LOGIN)');
						} else {
							$toast.error('Credenciales erróneas', 'Error desconocido (API_AUTH_UNKNOWN)');
						}
					}
					defer.reject(err);
				});
			
			return defer.promise;
		}
		
		function me( logining ) {
			var defer = $q.defer();
			if(isLogued() || logining){
				User.me().$promise
					.then(res => {
						$localStorage.setItem('$auth.token', res.access_token);
						$localStorage.setItem('$auth.user', res.me);
						$localStorage.setItem('$auth.userId', res.access_token.userId);
						$rootScope.$broadcast('$auth.user', res.me);
						defer.resolve(res);
					})
					.catch(err => {
						$log.debug(err);
						defer.reject(err);
					});
			} else {
				defer.reject();
			}
			return defer.promise;
		}
		
		function logout() {
			var defer = $q.defer();
			
			User.logout().$promise.then(res => {
				$localStorage.removeItem('$auth.token');
				$localStorage.removeItem('$auth.user');
				$localStorage.removeItem('$auth.userId');
				$localStorage.removeItem('$auth.settings');
				
				defer.resolve(res);
				$state.login();
				$toast.info('Sesión cerrada correctamente');
			}).catch(err => {
				if(!err.handled){
					// $toast.error('Error de usuario', 'Error al intentar desloguear al usuario (API_AUTH_LOGOUT)');
				}
				$localStorage.removeItem('$auth.token');
				$localStorage.removeItem('$auth.user');
				$localStorage.removeItem('$auth.userId');
				$localStorage.removeItem('$auth.settings');
				LoopBackAuth.clearStorage();
				LoopBackAuth.clearUser();
				$state.login();
				$toast.info('Sesión cerrada correctamente');
				defer.reject(err);
			});
			
			return defer.promise;
		}
		
		function recovery( email ) {
			var defer = $q.defer();
			User.resetPassword({
				email: email
			}).$promise
				.then(res => {
					defer.resolve(res);
				})
				.catch(err => {
					defer.reject(err);
				});
			return defer.promise;
		}
		
		/* User Data */
		
		function isLogued() {
			return $localStorage.getItem('$auth.token') &&
				$localStorage.getItem('$auth.user') &&
				$localStorage.getItem('$auth.userId');
		}
		
		function create( name, email, idProvider, token ) {
			var defer = $q.defer();
			User.register(name, email, idProvider, token).$promise
				.then(res => {
					defer.resolve(res);
				})
				.catch(err => {
					if(err.status === 422){
						err.handled = true;
						$toast.error('Problema en registro', 'Nombre de usuario o email ya existe');
					}
					defer.reject(err);
				});
			return defer.promise;
		}
		
		function register( name, email, idProvider, token ) {
			var defer = $q.defer();
			create(name, email, idProvider, token)
				.then(() => {
					login(email, idProvider)
						.then(res => {
							defer.resolve(res);
						})
						.catch(err => {
							defer.reject(err);
						});
				})
				.catch(err => {
					defer.reject(err);
				});
			return defer.promise;
		}
		
		function token() {
			return $localStorage.getItem('$auth.token');
		}
		
		function id() {
			return $localStorage.getItem('$auth.userId');
		}
		
		function user( data ) {
			if(isLogued()){
				if(!data){
					return $localStorage.getItem('$auth.user');
				} else {
					if(data === 'token'){
						return token();
					}
					if(data === 'id'){
						return id();
					}
				}
			}
			
			return null;
		}
		
		function refreshToken() {
			var defer = $q.defer();
			User.refreshToken({
				token: LoopBackAuth.accessTokenId,
				ttl: SERVER.ttl
			}).$promise
				.then(res => {
					LoopBackAuth.accessTokenId = res.access_token.id;
					$localStorage.setItem('$auth.token', res.access_token);
					LoopBackAuth.save();
					defer.resolve();
				})
				.catch(err => {
					defer.reject(err);
					logout();
				});
			
			return defer.promise;
		}
		
		function update( uData ) {
			var defer = $q.defer();
			/* Informacion Innecesaria */
			var userData = angular.copy(uData);
			delete userData.id;
			delete userData.file;
			/* ------ o -------- */
			User.prototype$updateAttributes({id: id()}, userData)
				.$promise
				.then(() => {
					// Se actualiza el usuario en localStorage
					User.findOne({
						filter: {
							where: {
								id: id()
							},
							include: {
								relation: 'file',
								scope: {
									include: 'thumbnail'
								}
							}
						}
					}).$promise.then(res => {
						$localStorage.setItem('$auth.user', res);
						$rootScope.$broadcast('$auth.user', res);
						defer.resolve(res);
					});
				})
				.catch(err => {
					if(!err.handled){
						$toast.error('No se pudo guardar el perfil',
							'Hubo un problema al actualizar (API_PROFILE_UPDATE_' + err.status + ' )');
					}
					$log.error(err);
					defer.reject(err);
				});
			
			return defer.promise;
		}
		
		function changePassword( password ) {
			var defer = $q.defer();
			var userData = user();
			
			User.prototype$updateAttributes({id: userData.id}, {
				password: password
			}).$promise
				.then(res => {
					defer.resolve(res);
				})
				.catch(err => {
					defer.reject(err);
				});
			
			return defer.promise;
		}
		
		function password( password ) {
			String.prototype.hashCode = () => {
				var hash = 0, i, chr, len;
				if(this.length === 0) return hash;
				for(i = 0, len = this.length; i < len; i++){
					chr = this.charCodeAt(i);
					hash = ((hash << 5) - hash) + chr;
					hash |= 0; // Convert to 32bit integer
				}
				return hash;
			};
			
			return '' + password.hashCode();
		}
		
		return {
			password: password,
			login: login,
			logout: logout,
			isLogued: isLogued,
			refreshToken: refreshToken,
			register: register,
			changePassword: changePassword,
			me: me,
			recovery: recovery,
			user: user,
			update: update
		};
	});
