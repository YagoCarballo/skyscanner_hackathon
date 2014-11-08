angular.module('social-flights.controllers', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('cpController', function($scope){

    })

    .controller('appController', function($scope, $cookies, $location, $timeout, $mdSidenav){


        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
    })

    .controller('ToastCtrl', function($scope, $mdToast) {
        $scope.closeToast = function() {
            $mdToast.hide();
        };
    });