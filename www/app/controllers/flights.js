angular.module('social-flights.controllers.flights', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('flightsController', function($scope, $http, $cookieStore, $location, $mdToast){
        $scope.people = 1;
        $scope.loading = false;
        $scope.selected = undefined;
        $scope.countries = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.form = {
            from: 'EDI',
            to: 'LHR',
            inbound: (12).days().fromNow(),
            outbound: (7).days().fromNow()
        };

        $scope.search = function () {
            $http({
                url: backend+"/session/create",
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    apiKey: 'ilw27259291653502403180676980633',
                    country: 'GB',
                    currency: 'GBP',
                    locale: 'en-GB',
                    originplace: $scope.form.from,
                    destinationplace: $scope.form.to,
                    outbounddate: $scope.form.inbound,
                    inbounddate: $scope.form.outbound,
                    adults: $scope.people,
                    children: 1,
                    locationschema: 'lata'
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
                }
            }).success(function (data, status, headers, config) {
                if(data.status_code == "200"){
                    $scope.data_location = data.data;

                    $scope.loading = true;
                    findFlights ($scope, $http, $location);

                } else if(data.status_code == "403") {
                    $scope.registerError = data.status_code;

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');

                    $location.path("/login");
                }

                console.log(data.status_code);

            }).error(function(data, status, headers, config) {
                $scope.registerStatus = status;
                console.log(data);
            });
        };
    });

function findFlights ($scope, $http, $location) {
    $http({
        url: backend + "/session/poll/" + $scope.data_location.location.replace('http://partners.api.skyscanner.net/apiservices/pricing/v1.0/', ''),
        method: 'POST',
        dataType: 'json',
        data: {},
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'SOCIALFLIGHT ' + localStorage.getItem('access_token')
        }
    }).success(function (data, status, headers, config) {
        $scope.loading = false;

        $scope.flights = data;
        parseFlights($scope, data);

    }).error(function (data, status, headers, config) {
        $scope.loading = false;
        $scope.registerStatus = status;
        console.log(data);
    });
}

function parseFlights ($scope, raw) {
    $scope.flights = [];

    raw.Itineraries.forEach(function(route){
        var flight = {};

        raw.Legs.forEach(function(leg){
            if (leg.Id === route.InboundLegId) {
                flight.duration = leg.Duration;
                if (raw.Places[leg.SegmentIds[0]]) {
                    flight.from = raw.Places[leg.SegmentIds[0]].Code;
                }
                flight.stops = leg.Stops.length;

                raw.Carriers.forEach(function (carrier) {
                    if (carrier.Id === leg.Carriers[0]) {
                        flight.carrier = carrier.name;
                        flight.carrierLogo = carrier.ImageUrl;
                    }
                });

            } else if (leg.Id === route.OutboundLegId) {
                flight.to = raw.Places[leg.SegmentIds[0]].Code;
            }
        });

        $scope.flights.push(flight);
    });
}