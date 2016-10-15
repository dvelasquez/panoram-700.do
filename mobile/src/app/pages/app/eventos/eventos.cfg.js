'use strict';

angular.module('eventos.page')
	.config($stateProvider => {
		$stateProvider.state('app.eventos', {
			url: '/eventos/:id',
			templateUrl: 'app/eventos/eventos.tmpl.html',
			controller: 'EventosController',
			controllerAs: 'vm'
		});
	});