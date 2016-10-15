'use strict';

angular.module('localstorage.factory', [])
	.factory('$localStorage', localStorageService => {
		
		var localStorage = localStorageService;
		
		function getItem( key ) {
			if(localStorage.get(key)){
				return localStorage.get(key);
			}
			return null;
		}
		
		function setItem( key, value ) {
			return localStorage.set(key, value);
		}
		
		function removeItem( key ) {
			return localStorage.remove(key);
		}
		
		function existItem( key ) {
			return angular.isDefined(getItem(key));
		}
		
		function clear() {
			return localStorage.clearAll();
		}
		
		return {
			getItem: getItem,
			setItem: setItem,
			removeItem: removeItem,
			existItem: existItem,
			clear: clear
		};
	});