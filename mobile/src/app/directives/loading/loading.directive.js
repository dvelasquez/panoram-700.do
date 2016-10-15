'use strict';

angular.module('loading.directive', [])
	.directive('loading', () => {
		return {
			template: '<div ng-if="loading" class="loading"><ion-spinner icon="ripple"></ion-spinner></div>',
			replace: true,
			scope: {
				loading: '='
			},
			link: function( s, e ) {
			}
		};
	});
