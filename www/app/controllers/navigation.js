angular.module('social-flights.controllers.navigation', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('AppCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };
    })

    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.close = function() {
            $mdSidenav('left').close();
        };
    })

    .controller('RightCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.close = function() {
            $mdSidenav('right').close();
        };
    });