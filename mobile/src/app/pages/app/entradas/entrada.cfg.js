'use strict';

angular.module('entradas.page')
	.config($stateProvider => {
		$stateProvider.state('app.entradas', {
			url: '/entradas',
			abstract: true,
			templateUrl: 'app/app.tmpl.html'
		})
	});
