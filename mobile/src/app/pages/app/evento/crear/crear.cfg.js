'use strict';

angular.module('crear.evento.page')
	.config($stateProvider => {
		$stateProvider.state('app.evento.crear', {
			url: '/crear',
			templateUrl: 'app/evento/crear/crear.tmpl.html',
			controller: 'CrearEventoController',
			controllerAs: 'vm'
		});
	});
