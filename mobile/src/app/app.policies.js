'use strict';

angular.module('app')
	.config($provide => {
		
		$provide.decorator('$state', $delegate => {
			var states = $delegate.get();
			$delegate.login = name => {
				var login = _.find(states, {
					user: false,
					root: true
				});
				if(!name){
					$delegate.go(login.name);
				}
				return login;
			};
			$delegate.home = name => {
				var home = _.find(states, {
					user: true,
					root: true
				});
				if(!name){
					$delegate.go(home.name);
				}
				return home;
			};
			return $delegate;
		});
	})
	.run(( $rootScope, $state, $ionicSideMenuDelegate, $ionicHistory, $auth, $log ) => {
		$rootScope.$on('$stateChangeStart', ( ev, state ) => {
			if(state.name === $state.home(true).name || state.name === $state.login(true).name || state.isRoot){
				// $ionicHistory.clearHistory();
				if(state.name !== $state.home(true).name){
					$ionicHistory.clearCache();
					if(_.keys($ionicHistory.viewHistory().histories).length > 1){
						$ionicHistory.removeBackView();
					}
				}
				$ionicHistory.nextViewOptions({
					disableBack: true,
					historyRoot: true
				});
			}
			var isLogued = $auth.isLogued();
			if(state.user || angular.isUndefined(state.user)){
				$log.debug('POLICIES: User needed');
				if(!isLogued){
					ev.preventDefault();
					$state.login();
				}
			} else {
				$log.debug('POLICIES: Not user required');
				if(isLogued){
					ev.preventDefault();
					$state.home();
				}
			}
		});
	});
