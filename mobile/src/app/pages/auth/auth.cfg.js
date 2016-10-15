'use strict';

angular.module('auth.pages')
	.config($translatePartialLoaderProvider => {
		$translatePartialLoaderProvider.addPart('app/pages/auth');
	})
	.config($stateProvider => {
		$stateProvider.state('auth', {
			url: '/auth',
			abstract: true,
			template: '<ion-nav-view><ion-nav-bar class="bar-positive"></ion-nav-bar></ion-nav-view>'
		});
	});
