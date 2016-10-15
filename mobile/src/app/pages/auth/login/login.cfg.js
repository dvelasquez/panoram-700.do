'use strict';

angular.module('login.page')
	.config($stateProvider => {
		$stateProvider.state('auth.login', {
			url: '/login',
			templateUrl: 'auth/login/login.tmpl.html',
			controller: 'LoginController',
			controllerAs: 'vm',
			user: false,
			root: true
		});
	});
