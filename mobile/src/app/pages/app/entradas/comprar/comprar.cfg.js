'use strict';

angular.module('comprar.entradas.page')
	.config($stateProvider => {
		$stateProvider.state('app.entradas.comprar', {
			url: '/comprar',
			templateUrl: 'app/entradas/comprar/comprar.tmpl.html',
			controller: 'ComprarEntradasController',
			controllerAs: 'vm'
		});
	});
