'use strict';

angular.module('app', [
	/* Librerías */
	'ionic',
	'ngCordova',
	'ngSanitize',
	'ngCookies',
	'LocalStorageModule',
	'pascalprecht.translate',
	'ionic.rating',
	'ngCordovaOauth',
	'lbServices',
	/* Servicios */
	'ionic-native-transitions',
	/* Modules */
	'decorator.module',
	'provider.module',
	'utils.module',
	'components.module',
	'factories.module',
	'directive.module',
	'pages.module']);
