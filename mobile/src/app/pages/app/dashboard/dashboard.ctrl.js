'use strict';

angular.module('dashboard.page')
	.controller('DashboardController', function( $auth, $ionicSideMenuDelegate ) {
		var vm = this;
		
		vm.canSpeech = false;
		
		vm.openMenu = () => {
			$ionicSideMenuDelegate.toggleLeft();
		};
		
		vm.user = $auth.user();
		/* TODO: Revisar error con voz */
		/*
		 var recognition = false;
		 
		 var speechInterval = $interval( () => {
			try{
				vm.canSpeech = SpeechRecognition;
				
				vm.startRecognition = () => {
					recognition = new SpeechRecognition();
					recognition.onresult = function(event) {
						$log.debug(event);
						if(event.results.length > 0){
							$log.debug(event);
						}
					};
					recognition.onerror = function (error) {
						$log.debug(error);
					};
					if(recognition){
						recognition.start();
					}
				};
				$interval.cancel(speechInterval);
			} catch(e){
				$log.debug(e);
				$log.debug('No tiene reconocimiento de voz');
				
			}
		}, 1000 );*/
		
	});