'use strict';

angular.module('pages.module')
	.config($translatePartialLoaderProvider => {
		$translatePartialLoaderProvider.addPart('app/pages');
	});
