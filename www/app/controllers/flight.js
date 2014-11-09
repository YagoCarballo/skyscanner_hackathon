angular.module('social-flights.controllers.group', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('flightController', function($scope, $http, $cookieStore, $mdToast, $location, $routeParams, $mdBottomSheet) {
        $scope.flight_id = $routeParams.id;
        $scope.flight = {};

        $http({
            url: backend+"/flights/"+$scope.flight_id,
            method: 'GET',
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
            }
        }).success(function (data, status, headers, config) {
            console.log(data);

            if(data.flight == "200"){
                $scope.group = data.data;
                localStorage.setItem('groups', JSON.stringify(data.data));

            } else if(data.status_code == "403") {
                $scope.registerError = data.status_code;

                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                $location.path("/login");
            }

            console.log(data.status_code);

        }).error(function(data, status, headers, config) {
            $scope.registerStatus = status;
            console.log("error");
        });
    });