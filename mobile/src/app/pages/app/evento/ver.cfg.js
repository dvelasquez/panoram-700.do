'use strict';

angular.module('evento.page')
	.config($stateProvider => {
		$stateProvider.state('app.evento', {
			url: '/evento',
			templateUrl: 'app/app.tmpl.html'
		});
	});
