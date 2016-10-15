'use strict';

angular.module('recovery.page')
	.config($stateProvider => {
		$stateProvider.state('auth.recovery', {
			url: '/recovery',
			templateUrl: 'auth/recovery/recovery.tmpl.html',
			controller: 'RecoveryController',
			controllerAs: 'vm',
			user: false
		});
	});
