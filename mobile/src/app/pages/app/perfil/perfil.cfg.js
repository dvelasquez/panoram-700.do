'use strict';

angular.module('perfil.page')
	.config($stateProvider => {
		$stateProvider.state('app.perfil', {
			url: '/perfil',
			abstract: true,
			templateUrl: 'app/app.tmpl.html'
		});
	});
