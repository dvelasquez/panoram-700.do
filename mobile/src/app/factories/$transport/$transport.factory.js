'use strict';

angular.module('transport.factory', [])
	.factory('$transport', () => {
		
		var items = [];
		
		function setItem( key, value ) {
			items[key] = value;
		}
		
		function getItem( key ) {
			return items[key];
		}
		
		function removeItem( key ) {
			delete items[key];
		}
		
		return {
			setItem: setItem,
			getItem: getItem,
			removeItem: removeItem
		};
	});
