'use strict';

angular.module('lugar.page')
	.controller('LugarController', LugarController);

function LugarController( $scope, $request, $stateParams, $toast, $log ) {
	var vm = this;
	
	vm.loading = true;
	
	function obtenerLugar() {
		vm.loading = true;
		$request('Place', 'findOne', {
			filter: {
				where: {
					id: $stateParams.id
				}
			}
		})
			.then(res => {
				vm.lugar = res;
				$log.debug(res);
			})
			.catch(() => {
				$toast.error('No se logró obtener el lugar');
			});
	}
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.lugar'){
			obtenerLugar();
		}
	});
}
