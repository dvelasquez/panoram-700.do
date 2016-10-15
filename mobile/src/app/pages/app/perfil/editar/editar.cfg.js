'use strict';

angular.module('editar.perfil.page')
	.config( $stateProvider => {
		$stateProvider.state('app.perfil.editar', {
			url: '/editar',
			templateUrl: 'app/perfil/editar/editar.tmpl.html',
			controller: 'EditarPerfilController',
			controllerAs: 'vm'
		});
	} );
