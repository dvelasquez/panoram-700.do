'use strict';

angular.module('utils.module')
	.factory('ReactAngular', $compile => {
		var ReactAngular = ( reactElement, domElement ) => {
			ReactDOM.render(reactElement, domElement[0] || domElement);
		};
		ReactAngular.$compile = ( reactElement, domElement, scope ) => {
			var div = document.createElement('div');
			ReactDOM.render(reactElement, div);
			angular.element(domElement).html('');
			angular.element(domElement).append($compile(div)(scope));
		};
		return ReactAngular;
	});