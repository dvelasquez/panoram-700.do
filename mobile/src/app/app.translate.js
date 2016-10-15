'use strict';

angular.module('app')
	.config(( $translateProvider, $translatePartialLoaderProvider, APP_LANGUAGES ) => {
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: 'i18n/{part}/i18n/{lang}.json'
		});
		
		$translateProvider.useSanitizeValueStrategy('sce');
		
		$translateProvider.useLoaderCache(true);
		
		var languageKeys = [];
		for(var lang = APP_LANGUAGES.length - 1; lang >= 0; lang--){
			languageKeys.push(APP_LANGUAGES[lang].key);
		}
		
		console.log(languageKeys);
		
		$translateProvider
			.registerAvailableLanguageKeys(languageKeys, {
				'en_US': 'en',
				'en_UK': 'en',
				'es_US': 'es',
				'es_ES': 'es',
				'es_CL': 'es',
			});
		if(window.navigator.globalization){
			window.navigator.globalization.getPreferredLanguage(
				result => {
					$translateProvider.use(result.value);
				},
				error => {
					// error
				});
		} else{
			$translateProvider.use('es');
		}
		
		// store the users language preference in a cookie
		$translateProvider.useLocalStorage();
	});
