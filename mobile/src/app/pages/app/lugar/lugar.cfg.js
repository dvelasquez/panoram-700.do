'use strict';

angular.module('lugar.page')
	.config($stateProvider => {
		$stateProvider.state('app.lugar', {
			url: '/lugar/:id',
			templateUrl: 'app/lugar/lugar.tmpl.html',
			controller: 'LugarController',
			controllerAs: 'vm'
		});
	});


