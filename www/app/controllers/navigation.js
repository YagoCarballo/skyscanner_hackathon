angular.module('social-flights.controllers.navigation', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('appController', function($scope, $cookies, $location, $timeout, $mdSidenav){
        $scope.toggleLeft = function() {
            refreshMenu($scope);
            $mdSidenav('left').toggle();
        };
    })

    .controller('LeftCtrl', function($scope, $cookieStore, $location, $timeout, $mdSidenav) {
        var json_user = localStorage.getItem('user');
        if (json_user) {
            $scope.user = JSON.parse(json_user);
        }
        //$scope.user = $cookieStore.get('user');

        $scope.close = function() {
            $mdSidenav('left').close();
            refreshMenu($scope);
        };

        $scope.load = function (path) {
            if (path === '/logout') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                //$cookieStore.remove('access_token');
                //$cookieStore.remove('user');
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
            refreshMenu($scope);
        }
    });

function refreshMenu ($scope) {
    var json_token = localStorage.getItem('access_token');
    if (json_token) {
        $scope.isLoggedIn = true;
    } else {
        $scope.isLoggedIn = false;
    }
}