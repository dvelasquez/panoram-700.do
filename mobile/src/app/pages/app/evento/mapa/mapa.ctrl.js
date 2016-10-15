'use strict';

angular.module('mapa.evento.page')
	.controller('MapaEventoController', MapaEventoController);

function MapaEventoController( $scope, $transport, $log ) {
	var vm = this;
	vm.loading = false;
	function initialize() {
		$scope.$evalAsync( () => { vm.loading = true; } );
		var directionsService = new google.maps.DirectionsService();
		var locationItem = $transport.getItem('location');
		var location = new google.maps.LatLng(locationItem.lat, locationItem.lng);
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var mapOptions = {
			center: location,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById('map'),
			mapOptions);
		directionsDisplay.setMap(map);
		
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
		
		navigator.geolocation.getCurrentPosition(function( pos ) {
			var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			var request = {
				origin: me,
				destination: location,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function( result, status ) {
				if(status == google.maps.DirectionsStatus.OK){
					marker.setMap(null);
					directionsDisplay.setDirections(result);
					map.fitBounds(new google.maps.LatLngBounds(location, me));
					$scope.$evalAsync( () => { vm.loading = false; } );
					
				}else{
					$scope.$evalAsync( () => { vm.loading = false; } );
				}
			});
		}, function( error ) {
			$log.error('No se logró localizar tu posición');
			$scope.$evalAsync( () => { vm.loading = false; } );
		});
		
		
		$scope.map = map;
	}
	
	google.maps.event.addDomListener(window, 'load', initialize);
	
	$scope.$on('$stateChangeSuccess', ( ev, state ) => {
		if(state.name === 'app.evento.mapa'){
			initialize();
		}
	});
}
