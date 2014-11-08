angular.module('social-flights.controllers.navigation', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('AppCtrl', function($scope, $cookieStore, $timeout, $mdSidenav) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };
    })

    .controller('LeftCtrl', function($scope, $cookieStore, $location, $timeout, $mdSidenav) {
        $scope.user = $cookieStore.get('user');

        $scope.close = function() {
            $mdSidenav('left').close();
        };

        $scope.load = function (path) {
            if (path === '/logout') {
                $cookieStore.remove('access_token');
                $cookieStore.remove('user');
                $location.path('/');

            } else if (path === '/profile') {
                var user = $cookieStore.get('user');
                if (user) {
                    $location.path('/profile/'+user.id);
                } else {
                    $location.path('/login');
                }

            } else {
                $location.path(path);
            }

            $mdSidenav('left').close();
        }
    })

    .controller('RightCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.close = function() {
            $mdSidenav('right').close();
        };
    });