'use strict';

angular.module('crear.evento.page')
	.controller('CrearEventoController', CrearEventoController);

function CrearEventoController( $q, $auth, $scope, $request, $toast, $ionicModal, $http, $cordovaDialogs, $cordovaOauth, $ionicLoading, Activity, Tickets, $filter, $state, $log ) {
	var vm = this;
	
	vm.loading = false;
	vm.places = [];
	
	$ionicModal.fromTemplateUrl('app/evento/crear/lugar.tmpl.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(modal => {
		vm.modal = modal;
	});
	
	$ionicModal.fromTemplateUrl('app/evento/crear/entrada.tmpl.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(modal => {
		vm.modalEntrada = modal;
	});
	
	vm.openModal = function() {
		vm.modal.show();
	};
	vm.closeModal = function() {
		vm.modal.hide();
	};
	
	vm.openModalEntrada = function() {
		vm.modalEntrada.show();
	};
	vm.closeModalEntrada = function() {
		vm.modalEntrada.hide();
		vm.entrada = {
			category_id: 'MLC110931',
			currency_id: 'CLP',
			buying_mode: 'buy_it_now',
			condition: 'new'
		};
	};
	
	
	vm.selectPlace = function( place ) {
		vm.place = place;
		vm.evento.placeId = place.id;
		vm.closeModal();
	};
	
	vm.publicarEntrada = function() {
		vm.openModalEntrada();
	};
	
	vm.saveEntrada = function() {
		if(parseInt(vm.entrada.available_quantity) <= 0 || !angular.isNumber(vm.entrada.available_quantity)){
			$toast.error('La cantidad no es válida');
			return;
		}
		if(parseInt(vm.entrada.price) <= 0 || !angular.isNumber(vm.entrada.price)){
			$toast.error('El precio no es válido');
			return;
		}
		vm.modalEntrada.hide();
	};
	
	vm.buscarLugar = () => {
		vm.openModal();
		vm.loading = true;
		$request('Place', 'find', {})
			.then(null, null, res => {
				vm.places = res;
				vm.loading = false;
			})
			.finally(() => {
				vm.loading = false;
			});
	};
	
	function mercadoLibre() {
		var defer = $q.defer();
		$cordovaOauth.mercadolibre(6092340067825346)
			.then(function( res ) {
				defer.resolve(res);
			})
			.catch(function( err ) {
				defer.reject(err);
			});
		
		return defer.promise;
	}
	
	function publicarMercadoLibre( res ) {
		var defer = $q.defer();
		
		$http.post('https://api.mercadolibre.com/items?access_token=' + res.access_token, vm.entrada)
			.then(function( res ) {
				defer.resolve(res);
			}, function( err ) {
				$log.debug('Error', err);
				defer.reject(err);
			});
		
		return defer.promise;
	}
	
	function enviarTicket( event ) {
		var defer = $q.defer();
		Tickets.create({
			activityId: event.id,
			price: vm.entrada.price,
			available: vm.entrada.available_quantity,
			total: vm.entrada.available_quantity
		}).$promise
			.then(function( ticket ) {
				defer.resolve(ticket);
			})
			.catch(function( err ) {
				defer.reject(err);
			});
		return defer.promise;
	}
	
	function enviarEvento( redirect ) {
		var defer = $q.defer();
		vm.evento.ownerId = vm.user.id;
		Activity.create(vm.evento).$promise
			.then(function( res ) {
				vm.eventoCreado = res;
				defer.resolve(res);
				if(redirect){
					$ionicLoading.hide();
					$state.go('app.evento.ver', {id: res.id});
				}
			})
			.catch(function() {
				defer.reject();
				$toast.error('No se logró publicar el evento');
				$ionicLoading.hide();
			});
		
		return defer.promise;
	}
	
	vm.guardarEvento = () => {
		$ionicLoading.show({
			template: $filter('translate')('SENDING')
		});
		if(vm.entrada.title && vm.entrada.price >= 0){
			mercadoLibre()
				.then(function( res ) {
					publicarMercadoLibre(res)
						.then(function() {
							enviarEvento()
								.then(function( event ) {
									enviarTicket(event)
										.finally(function() {
											$ionicLoading.hide();
											$state.go('app.evento.ver', {id: event.id});
										});
								});
						})
						.catch(function() {
							$cordovaDialogs.confirm('No se logró publicar la entrada', '¿Deseas publicar el evento de todas formas?', ['Aceptar', 'Cancelar'])
								.then(function( buttonIndex ) {
									// no button = 0, 'OK' = 1, 'Cancel' = 2
									if(buttonIndex === 2){
										$toast.info('No se publicó el evento');
										$ionicLoading.hide();
									} else {
										enviarEvento(true);
									}
									
								});
						});
				})
				.catch(function() {
					$cordovaDialogs.confirm('No se publicará la entrada', '¿Deseas publicar el evento de todas formas?', ['Aceptar', 'Cancelar'])
						.then(function( buttonIndex ) {
							// no button = 0, 'OK' = 1, 'Cancel' = 2
							if(buttonIndex === 2){
								$toast.info('No se publicó el evento');
								$ionicLoading.hide();
							} else {
								enviarEvento(true);
							}
							
						});
					
				});
		} else {
			enviarEvento(true);
		}
	};
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.evento.crear'){
			vm.user = $auth.user();
			vm.evento = {};
			vm.entrada = {
				category_id: 'MLC116439',
				currency_id: 'CLP',
				buying_mode: 'buy_it_now',
				listing_type_id: 'gold_special',
				condition: 'new'
			};
			vm.place = null;
		}
	});
	
	
}
