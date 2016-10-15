'use strict';

angular.module('toast.factory', [])
	.factory('$toast', ( $window, $timeout, $cordovaToast, $log ) => {
		
		var lastMessage = null;
		
		function toastLegacy( m, kind ) {
			var style = '';
			if(kind === 'error'){
				style = 'background-color: #e74c3c; color: #FFFFFF; font-size: 1rem; font-family: Arial, sans-serif; padding: 0.2rem';
			}
			if(kind === 'success'){
				style = 'background-color: #86b52d; color: #ffffff; font-size: 1rem; font-family: Arial, sans-serif; padding: 0.2rem';
			}
			$log.debug('TOAST: %c' + m, style);
		}
		
		function toast( title, message, time, opts ) {
			var realMessage = title;
			if(message){
				realMessage += ' \n' + message;
			}
			
			var options = {
				message: realMessage,
				duration: time || 4000, // 2000 ms
				position: 'bottom'
			};
			angular.extend(options, opts);
			if($window.plugins && $window.plugins.toast && $cordovaToast){
				if(lastMessage !== realMessage){
					lastMessage = realMessage;
					$cordovaToast.showWithOptions(options);
					$timeout(() => {
						lastMessage = null;
					}, 4500);
				}
			} else{
				toastLegacy(realMessage, opts.kind || 'info');
			}
		}
		
		function info( title, message, time ) {
			toast(title, message, time, {
				kind: 'info'
			});
		}
		
		function success( title, message, time ) {
			toast(title, message, time, {
				kind: 'success',
				styling: {
					backgroundColor: '#86b52d', // make sure you use #RRGGBB. Default #333333
					textColor: '#FFFFFF' // Ditto. Default #FFFFFF
				}
			});
		}
		
		function error( title, message, time ) {
			toast(title, message, time, {
				kind: 'error',
				styling: {
					backgroundColor: '#e74c3c', // make sure you use #RRGGBB. Default #333333
					textColor: '#FFFFFF' // Ditto. Default #FFFFFF
				}
			});
		}
		
		return {
			info: info,
			success: success,
			error: error
		};
	});
