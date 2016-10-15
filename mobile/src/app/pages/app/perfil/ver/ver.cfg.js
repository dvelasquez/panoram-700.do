'use strict';

angular.module('ver.perfil.page')
	.config( $stateProvider => {
		$stateProvider.state('app.perfil.ver', {
			url: '/ver',
			templateUrl: 'app/perfil/ver/ver.tmpl.html',
			controller: 'VerPerfilController',
			controllerAs: 'vm'
		});
	} );
