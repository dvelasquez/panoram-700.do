'use strict';

angular.module('contrasena.perfil.page')
	.controller('ContrasenaPerfilController', ContrasenaPerfilController);

function ContrasenaPerfilController( $scope, $ionicLoading, $filter, $auth, $toast, $state ) {
	var vm = this;
	
	vm.password = {};
	
	vm.cambiarPassword = cambiarPassword;
	
	function cambiarPassword() {
		if(vm.password.new && (vm.password.new === vm.password.repeat)){
			$ionicLoading.show({
				template: $filter('translate')('SENDING')
			});
			$auth.changePassword(vm.password.new)
				.then(() => {
					$toast.success('Contraseña cambiada correctamente');
					$state.go('app.perfil.ver');
				})
				.catch(() => {
					$toast.error('No se logró cambiar la contraseña, intenta más tarde');
				})
				.finally(() => {
					$ionicLoading.hide();
				});
		}else{
			$toast.error('Debes ingresar la contraseña nueva');
		}
	}
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.perfil.contrasena'){
			vm.password = {};
		}
	});
}
