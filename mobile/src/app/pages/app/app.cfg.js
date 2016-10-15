'use strict';

angular.module('app.pages')
	.config($stateProvider => {
		$stateProvider.state('app', {
			url: '/app',
			abstract: true,
			template: '<ion-nav-view><ion-nav-bar class="bar-positive"></ion-nav-bar></ion-nav-view>'
		});
	});
