'use strict';

angular.module('ver.perfil.page')
	.controller('VerPerfilController', VerPerfilController);

function VerPerfilController( $scope, $auth, $cordovaDialogs, $ionicBackdrop, $toast ) {
	var vm = this;
	
	class Actions {
		cerrarSesion() {
			$ionicBackdrop.retain();
			$cordovaDialogs.confirm('¿Estás seguro de querer cerrar sesión?', 'Cerrar sesión', ['Aceptar', 'Cancelar'])
				.then(function( buttonIndex ) {
					
					if(buttonIndex === 1){
						$auth.logout()
							.then(() => {
								$toast.info('Sesión cerrada correctamente');
							})
							.catch(() => {
								$toast.error('No se pudo cerrar sesión');
							})
							.finally(() => {
								$ionicBackdrop.release();
							});
					} else {
						$ionicBackdrop.release();
					}
					
				});
			
		}
	}
	
	vm.actions = new Actions();
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.perfil.ver'){
			vm.user = $auth.user();
		}
	});
	
}
