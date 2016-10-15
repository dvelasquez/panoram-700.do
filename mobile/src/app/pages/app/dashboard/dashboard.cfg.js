'use strict';

angular.module('dashboard.page')
	.config($stateProvider => {
		$stateProvider.state('app.dashboard', {
			url: '/dashboard',
			templateUrl: 'app/dashboard/dashboard.tmpl.html',
			controller: 'DashboardController',
			controllerAs: 'vm',
			user: true,
			root: true
		});
	});
