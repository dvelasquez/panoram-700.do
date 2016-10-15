'use strict';

angular.module('contrasena.perfil.page')
	.config($stateProvider => {
		$stateProvider.state('app.perfil.contrasena', {
			url: '/contrasena',
			templateUrl: 'app/perfil/contrasena/contrasena.tmpl.html',
			controller: 'ContrasenaPerfilController',
			controllerAs: 'vm'
		});
	});