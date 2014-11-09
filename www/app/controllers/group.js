angular.module('social-flights.controllers.group', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('groupController', function($scope, $http, $cookieStore, $mdToast, $location, $routeParams, $mdBottomSheet) {
        $scope.group_id = $routeParams.id;
        $scope.group = {};

        $http({
            url: backend+"/groups/"+$scope.group_id,
            method: 'GET',
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
            }
        }).success(function (data, status, headers, config) {
            console.log(data);

            if(data.status_code == "200"){
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

        $scope.openProfile = function (member) {
            $location.path("/profile/"+member.id);
        };

        $scope.flightDetails = function (flight) {
            $location.path("/flight/"+flight.id);
        };

        $scope.findFlights = function () {
            $location.path("/flights");
        };

        fetchFlighs($scope, $http, $location);
    });

function fetchFlighs ($scope, $http, $location) {
    $http({
        url: backend+"/groups/"+$scope.group_id+'/flights',
        method: 'GET',
        dataType: 'json',
        data: {},
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
        }
    }).success(function (data, status, headers, config) {
        console.log(data);

        if(data.status_code == "200"){
            $scope.flights = data.data;
            localStorage.setItem('flights', JSON.stringify(data.data));

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
}