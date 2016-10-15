'use strict';

angular.module('eventos.page')
	.controller('EventosController', EventosController);

function EventosController( $scope, Activity, $toast, $stateParams, $cordovaStatusbar, $request, $log ) {
	
	var vm = this;
	vm.loading = false;
	vm.activities = [];
	
	/*
	 *
	 * $red: #CB2402;
	 $pink: #DB2464;
	 $blue: #4C49A2;
	 $green: #B8DC3C;
	 $purple: #A31A48;
	 $darken: #35235D;
	 $orange: #E8B143;
	 $dark: #3B3B47;*/
	
	var categories = {
		recomendados: {
			title: 'Recomendados',
			icon: 'ion-star',
			clase: 'bar-eventos-red',
			color: '#CB2402'
		},
		ver: {
			title: 'Ver',
			icon: 'ion-eye',
			clase: 'bar-eventos-darken',
			color: '#35235D'
		},
		escuchar: {
			title: 'Escuchar',
			icon: 'ion-headphone',
			clase: 'bar-eventos-green',
			color: '#B8DC3C'
		},
		apreciar: {
			title: 'Apreciar',
			icon: 'ion-image',
			clase: 'bar-eventos-blue',
			color: '#4C49A2'
		},
		moverme: {
			title: 'Moverme',
			icon: 'ion-map',
			clase: 'bar-eventos-purple',
			color: '#A31A48'
		},
		descubrir: {
			title: 'Descubrir',
			icon: 'ion-compass',
			clase: 'bar-eventos-pink',
			color: '#DB2464'
		},
		comer: {
			title: 'Comer',
			icon: 'ion-pizza',
			clase: 'bar-eventos-orange',
			color: '#E8B143'
		},
		noche: {
			title: 'Vida nocturna',
			icon: 'ion-beer',
			clase: 'bar-eventos-dark',
			color: '#3B3B47'
		}
	};
	
	function findActivities() {
		vm.loading = true;
		$request('Activity', 'find', {
			filter: {
				order: 'startDate DESC',
				include: ['place', 'tickets']
			}
		})
			.then(() => {
				vm.loading = false;
			}, null, res => {
				vm.activities = res;
				$log.debug(res);
			})
			.catch(err => {
				$log.debug(err);
				$toast.error('No se logró actualizar la lista');
			})
			.finally(() => {
				vm.loading = false;
			});
	}
	
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.eventos'){
			findActivities();
			vm.category = categories[$stateParams.id];
			try{
				$cordovaStatusbar.styleHex(vm.category.color);
			} catch(e){
			}
		} else {
			try{
				$cordovaStatusbar.styleHex('#354076');
			} catch(e){
			}
		}
	});
	
}
