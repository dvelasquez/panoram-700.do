'use strict';

angular.module('editar.perfil.page')
	.controller('EditarPerfilController', EditarPerfilController);

function EditarPerfilController( $scope, $auth ) {
	
	var vm = this;
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.perfil.editar'){
			vm.user = $auth.user();
		}
	});
	
}
