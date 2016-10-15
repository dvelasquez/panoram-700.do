'use strict';

angular.module('app')
	.config($urlRouterProvider => {
		$urlRouterProvider.otherwise('/auth/login');
	});
