'use strict';

angular.module('ver.evento.page')
	.controller('VerEventoController', VerEventoController);

function VerEventoController( $scope, $auth, $state, $stateParams, Activity, $toast, $transport, $request, $ionicLoading, $ionicModal, $filter, Attendance, $log ) {
	var vm = this;
	vm.loading = false;
	vm.activity = {};
	vm.comment = {
		rating: 3,
		text: ''
	};
	
	$ionicModal.fromTemplateUrl('app/evento/ver/checkin.tmpl.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(modal => {
		vm.modal = modal;
	});
	
	vm.openModal = function() {
		vm.modal.show();
	};
	vm.closeModal = function() {
		vm.modal.hide();
	};
	
	function findActivity() {
		vm.loading = true;
		$request('Activity', 'findOne', {
			filter: {
				where: {
					id: $stateParams.id
				},
				include: ['place', 'tickets']
			}
		})
			.then(null, null, res => {
				vm.activity = res;
				$log.debug(res);
				$transport.setItem('location', res.place.location);
			})
			.catch(err => {
				$toast.error('No se puede obtener el evento');
				$state.go('app.dashboard');
			})
			.finally(() => {
				vm.loading = false;
			});
	}
	
	class Actions {
		hacerChecking() {
			vm.modal.show();
		}
		
		enviarChecking() {
			$ionicLoading.show({
				template: $filter('translate')('SENDING')
			});
			Attendance.create({
				activity: vm.activity.id,
				place: vm.activity.placeId,
				user: vm.user.id,
				rating: vm.comment.rating,
				tips: vm.comment.text
			}).$promise
				.then(function() {
					$toast.success('Comentario enviado');
				})
				.catch(() => {
					$toast.error('No se logró enviar la calificación');
				})
				.finally(() => {
					vm.closeModal();
					$ionicLoading.hide();
				});
		}
	}
	
	vm.actions = new Actions();
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.evento.ver'){
			vm.user = $auth.user();
			vm.comment = {
				rating: 3,
				text: ''
			};
			findActivity();
		}
	});
	
	$scope.$on('$destroy', function() {
		try{
			$scope.modal.remove();
		} catch(e){
			
		}
	});
}
