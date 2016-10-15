'use strict';

angular.module('datepicker.directive', [])
	.directive('datePicker', ( $cordovaDatePicker, $toast ) => {
		return {
			require: 'ngModel',
			scope: {
				past: '=',
				mode: '@',
				format: '@'
			},
			link: ( s, e, a, ctrl ) => {
				var date = new Date();
				
				if( s.format ){
					s.format = 'DD-MM-YYYY';
				}
				
				function clickFunction() {
					angular.element(e).off('click');
					try{
						if(datePicker){ // eslint
							var options = {
								date: date,
								mode: s.mode || 'date', // or 'time'
								allowOldDates: true,
								allowFutureDates: false,
								doneButtonLabel: 'Aceptar',
								doneButtonColor: '#F2F3F4',
								cancelButtonLabel: 'Cancelar',
								cancelButtonColor: '#000000',
								titleText: 'Seleccione fecha',
								is24Hour: true,
								androidTheme: datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
								locale: 'es_la'
							};
							if(!s.past){
								options.allowOldDates = false;
							}
							
							$cordovaDatePicker.show(options)
								.then(date => {
									ctrl.$modelValue = moment(new Date(date)).format(s.format);
									ctrl.$setViewValue(moment(new Date(date)).format(s.format));
								})
								.finally(() => {
									angular.element(e).on('click', clickFunction);
								});
						}
					} catch(e){
						$toast.error('Error', 'Hubo un problema al cargar un plugin (PLUGIN_FAILED_DATEPICKER)');
					}
				}
				
				function formatDate( value ) {
					var fecha = new Date();
					if(!value){
						value = fecha;
					}
					date = value;
					return value;
				}
				
				function createDate( value ) {
					var date = moment(new Date()).format(s.format);
					if(!value){
						value = date;
					}
					return value;
				}
				
				angular.element(e).on('click', clickFunction);
				
				ctrl.$parsers.unshift(formatDate);
				
				ctrl.$setViewValue(createDate());
			}
		};
	});
