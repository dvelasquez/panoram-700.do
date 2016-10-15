'use strict';

angular.module('register.page')
	.controller('RegisterController', RegisterController);

function RegisterController( $auth, $facebook, $state, $ionicBackdrop, $ionicLoading, $toast, $filter, $timeout, $log ) {
	var vm = this;
	
	vm.register = {
		name: '',
		email: '',
		password: '',
		repeatPassword: ''
	};
	
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
	
	/*  */
	
	class Actions {
		register() {
			$ionicLoading.show({
				template: $filter('translate')('SENDING')
			});
			vm.register.username = vm.register.email;
			delete vm.register.repeatPassword;
			$auth.register(vm.register)
				.then(() => {
					$state.go('app.dashboard');
				})
				.catch(err => {
					if(!err.handled){
						$toast.error('No se logró registrar al usuario');
					}
				})
				.finally(() => {
					$ionicLoading.hide();
				});
		}
		
		registerFacebook() {
			$ionicBackdrop.retain();
			$facebook.login()
				.then(function( me ) {
					$auth.register(me.name, me.email, me.id, me.authResponse.accessToken)
						.then(function() {
							// $calendar.updateAll();
						})
						.finally(function() {
							vm.loading = false;
							$ionicBackdrop.release();
						});
				})
				.catch(function() {
					vm.loading = false;
					$ionicBackdrop.release();
				});
		}
	}
	
	vm.actions = new Actions();
}