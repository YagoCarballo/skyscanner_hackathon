angular.module('social-flights.controllers.flight', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('flightController', function($scope, $http, $cookieStore, $mdToast, $location, $routeParams, $window, $mdBottomSheet) {
        $scope.flight_id = $routeParams.id;
        $scope.flight = {
            title : '',
            out_date : new Date(),
            description: ''
        };

        $scope.parseDate = function (date) {
            return new Date(date).toString('dd-MM-yyyy');
        };

        $scope.buy = function () {
            PopulateDB($scope, $http, $location, $scope.flight);
            $window.open($scope.flight.deeplink);
        };

        $scope.hideButton = false;
        $scope.checkUserFlights = function (flight) {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                user.flights.forEach(function (userFlight) {
                    if (flight === userFlight) {
                        $scope.hideButton = true;
                    }
                });
            }
        };

        $scope.checkUserFlights($scope.flight_id);

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

            if(data.status_code == "200"){
                $scope.flight = data.data;

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

        $scope.confirm = function () {
            if (!$scope.flight.confirmed) {
                $scope.flight.confirmed = true;
                return;
            }

            $http({
                url: backend+"/user/confirm_flight/"+$scope.flight.id,
                method: 'POST',
                dataType: 'json',
                data: {},
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
                }
            }).success(function (data, status, headers, config) {
                console.log(data);

                if(data.status_code == "200"){
                    $scope.task = data.data;

                } else if(data.status_code == "403") {
                    $scope.registerError = data.status_code;

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');

                    $location.path("/login");

                }  else if (data.status_code == "409"){
                    $scope.formError = data.status_code + " - Group already exists.";
                }

                console.log(data.status_code);

            }).error(function(data, status, headers, config) {
                $scope.registerStatus = status;
                console.log("error");
            });
        };
    });

function PopulateDB ($scope, $http, $location, flight) {
    var user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        $http({
            url: backend + '/user/'+user.id+'/flight',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                country: 'GB',
                currency: 'GBP',
                locale: 'en-GB',
                originplace: flight.from,
                destinationplace: flight.to,
                outbounddate: new Date(flight.outbound).toString('yyyy-MM-dd'),
                inbounddate: new Date(flight.inbound).toString('yyyy-MM-dd'),
                adults: $scope.people,
                children: 0,
                price: flight.price,
                outboundlegid: flight.outboundlegid,
                inboundlegid: flight.inboundlegid,
                deeplink: flight.url
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'SOCIALFLIGHT ' + localStorage.getItem('access_token')
            }
        }).success(function (data, status, headers, config) {
        }).error(function (data, status, headers, config) {
            $scope.loading = false;
            $scope.registerStatus = status;
            console.log(data);
        });
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        $location.path("/login");
    }
}