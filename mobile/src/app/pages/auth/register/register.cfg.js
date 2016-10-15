'use strict';

angular.module('register.page')
	.config($stateProvider => {
		$stateProvider.state('auth.register', {
			url: '/register',
			templateUrl: 'auth/register/register.tmpl.html',
			controller: 'RegisterController',
			controllerAs: 'vm',
			user: false
		});
	});
