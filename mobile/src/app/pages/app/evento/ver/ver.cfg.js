'use strict';

angular.module('ver.evento.page')
	.config($stateProvider => {
		$stateProvider.state('app.evento.ver', {
			url: '/ver/:id',
			templateUrl: 'app/evento/ver/ver.tmpl.html',
			controller: 'VerEventoController',
			controllerAs: 'vm'
		});
	});
