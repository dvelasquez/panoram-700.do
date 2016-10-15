'use strict';

angular.module('app')
	
	.constant('VER', 'v1.0.0')
	
	.constant('SERVER', {
		'url': 'http://10.77.70.98:3000/api',
		'ttl': (60 * 60 * 24) // Un día de token válido
	})
	
	.constant('APP_LANGUAGES', [{
		name: 'LANGUAGES.SPANISH',
		key: 'es'
	}])
	
	.config(( $ionicConfigProvider, $ionicNativeTransitionsProvider ) => {
		$ionicNativeTransitionsProvider.setDefaultTransition({
			duration: 400
		});
		$ionicConfigProvider.views.swipeBackEnabled(false);
	})
	
	.config(( LoopBackResourceProvider, SERVER ) => {
		LoopBackResourceProvider.setAuthHeader('X-Access-Token');
		LoopBackResourceProvider.setUrlBase(SERVER.url);
	})
	
	.config($facebookProvider => {
		$facebookProvider.setPermission(
			['email', 'user_about_me', 'user_likes', 'user_location']
		);
	})
	
	.config($uiViewScrollProvider => {
		$uiViewScrollProvider.useAnchorScroll();
	})
	
	.config($ionicConfigProvider => {
		$ionicConfigProvider.navBar.alignTitle('center');
		$ionicConfigProvider.backButton.previousTitleText('Volver');
		$ionicConfigProvider.backButton.text('Volver').icon('fi flaticon-back');
		$ionicConfigProvider.form.checkbox('circle');
		$ionicConfigProvider.scrolling.jsScrolling(true);
	});
