'use strict';

angular.module('recovery.page')
	.controller('RecoveryController', RecoveryController);

function RecoveryController( $auth, $toast, $rootScope, $state, $ionicLoading, $filter ) {
	var vm = this;
	
	vm.result = null;
	vm.recovery = {
		email: ''
	};
	
	/* Actions */
	class Actions {
		acceptOk() {
			$state.go('auth.login');
		}
		
		acceptCancel() {
			vm.result = null;
		}
		
		recovery() {
			if(vm.recovery.email){
				$ionicLoading.show({
					template: $filter('translate')('SENDING')
				});
				/* TODO: Manejar resultado */
				$auth.recovery(vm.recovery.email)
					.then(res => {
						if(res.response){
							vm.result = res.response;
						} else {
							vm.result = 'ERROR';
						}
					})
					.catch(err => {
						console.log(err.data);
						if(!err.handled){
							if( err.data && err.data.error && err.data.error.code ){
								if( err.data.error.code === 'EMAIL_NOT_FOUND' ){
									vm.result = 'ERROR';
								}
							}else{
								$toast.error('No se ha logrado completar la acción')
							}
						}
					})
					.finally(() => {
						$ionicLoading.hide();
					});
			} else {
				$toast.error('Debes ingresar el correo electrónico');
			}
		}
	}
	
	vm.actions = new Actions();
	
	var on = $rootScope.$on('$stateChangeSuccess', function( ev, state ) {
		if(state.name === 'auth.recovery'){
			vm.result = null;
			vm.recovery = {
				email: ''
			};
		}
	});
	
	$rootScope.$on('$destroy', function() {
		on();
	});
}