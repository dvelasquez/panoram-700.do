'use strict';

angular.module('login.page')
	.controller('LoginController', LoginController);

function LoginController( $auth, $timeout, $ionicLoading, $ionicBackdrop, $toast, $filter, $state, $facebook ) {
	var vm = this;
	
	/* TODO: Testing function */
	function testing() {
		var result = Math.ceil(Math.random() * 2) > 1;
		$timeout(function() {
			$ionicBackdrop.release();
			if(!result){
				$toast.error('No se ha logrado conectar con facebook');
			}
		}, 3500);
	}
	
	/* ** ** ** */
	
	class Actions {
		login() {
			$ionicLoading.show({
				template: $filter('translate')('SENDING')
			});
			
			/* TODO: Manejar respuesta real */
			$auth.login(vm.login.email, vm.login.password)
				.then(() => {
					// $state.go('app.dashboard');
				})
				.catch(() => {
					$toast.error('Error de usuario o contraseña');
				})
				.finally(() => {
					$ionicLoading.hide();
				});
		}
		
		loginFacebook() {
			vm.loading = true;
			$facebook.login()
				.then(function( me ) {
					$auth.login(me.email, me.id)
						.then(function() {
							// $calendar.updateAll();
						})
						.finally(function() {
							vm.loading = false;
						});
				})
				.catch(function() {
					vm.loading = false;
				});
		}
	}
	
	vm.actions = new Actions();
	
}