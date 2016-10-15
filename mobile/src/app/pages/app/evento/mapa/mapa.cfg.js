'use strict';

angular.module('mapa.evento.page')
	.config( $stateProvider => {
		$stateProvider.state('app.evento.mapa', {
			url: '/mapa',
			templateUrl: 'app/evento/mapa/mapa.tmpl.html',
			controller: 'MapaEventoController',
			controllerAs: 'vm'
		});
	});
