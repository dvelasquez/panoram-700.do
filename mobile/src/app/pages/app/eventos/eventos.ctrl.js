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
			color: '#CB2403',
			verbo: ''
		},
		ver: {
			title: 'Ver',
			icon: 'ion-eye',
			clase: 'bar-eventos-darken',
			color: '#981b02',
			verbo: 'ver'
		},
		escuchar: {
			title: 'Escuchar',
			icon: 'ion-headphone',
			clase: 'bar-eventos-green',
			color: '#3c397f',
			verbo: 'escuchar'
		},
		apreciar: {
			title: 'Apreciar',
			icon: 'ion-image',
			clase: 'bar-eventos-blue',
			color: '#35235D',
			verbo: 'vivir'
		},
		moverme: {
			title: 'Moverme',
			icon: 'ion-map',
			clase: 'bar-eventos-purple',
			color: '#DB2464',
			verbo: 'aire libre'
		},
		descubrir: {
			title: 'Descubrir',
			icon: 'ion-compass',
			clase: 'bar-eventos-pink',
			color: '#af1d50',
			verbo: 'aire libre'
		},
		comer: {
			title: 'Comer',
			icon: 'ion-pizza',
			clase: 'bar-eventos-orange',
			color: '#dd9c1b',
			verbo: 'comer'
		},
		noche: {
			title: 'Vida nocturna',
			icon: 'ion-beer',
			clase: 'bar-eventos-dark',
			color: '#E8B143',
			verbo: 'vida nocturna'
		}
	};
	
	function findActivities() {
		vm.loading = true;
		$request('Type', 'getFilteredActivities', {
			type: vm.category.verbo
		})
			.then(( res ) => {
				vm.loading = false;
				vm.activities = res.activities;
			}, null, res => {
				vm.activities = res.activities;
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
			vm.activities = [];
			vm.category = categories[$stateParams.id];
			findActivities();
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
