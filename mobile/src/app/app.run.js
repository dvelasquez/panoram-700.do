'use strict';

angular.module('app')
	.run(( $rootScope, $timeout, $ionicPlatform, $cordovaStatusbar, $state, $ionicHistory, $translate, $ionicNativeTransitions, $ionicSideMenuDelegate, $fileCache, $cordovaGlobalization, SERVER, VER ) => {
		moment.locale('es-LA');
		
		$ionicPlatform.ready(() => {
			if(ionic.Platform.isIOS()){
				$timeout(() => {
					if(navigator && navigator.splashscreen){
						navigator.splashscreen.hide();
					}
				}, 250);
			}
			
			if(window.navigator.globalization){
				window.navigator.globalization.getPreferredLanguage(
					result => {
						$translate.use(result.value);
					},
					error => {
						// error
					});
			} else{
				$translate.use('es');
			}
			
			if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard){
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
				
			}
			if(window.StatusBar){
				// org.apache.cordova.statusbar required
				window.StatusBar.styleLightContent();
				$cordovaStatusbar.styleHex('#354076');
			}
			if(typeof TestFairy != 'undefined'){
				// TestFairy.begin("88018c43817eb636cac56ed9e1dbe64148625641");
			}
			
		});
		$rootScope.$notification = 0;
		$rootScope.rootLoading = false;
		$rootScope.rootLoadingMessage = 'Cargando...';
		$rootScope.VER = VER;
		$rootScope.hasBackView = false;
		$rootScope.goBack = () => {
			// $ionicHistory.goBack();
			var histories = $ionicHistory.viewHistory();
			var backView = histories.backView;
			if(!backView){
				backView = {
					stateName: 'dashboard.home',
					stateParams: null
				};
			}
			$ionicNativeTransitions.stateGo(backView.stateName, backView.stateParams, {}, {
				type: 'slide',
				direction: 'right', // 'left|right|up|down', default 'left' (which is like 'next')
				duration: 400 // in milliseconds (ms), default 400
			});
			
		};
		$rootScope.$on('$stateChangeSuccess', () => {
			$ionicSideMenuDelegate.toggleRight(false);
			$ionicSideMenuDelegate.toggleLeft(false);
			var histories = _.keys($ionicHistory.viewHistory().histories);
			if(histories.length > 1){
				$rootScope.hasBackView = true;
			}
		});
	});