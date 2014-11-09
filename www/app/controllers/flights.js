angular.module('social-flights.controllers.flights', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('flightsController', function($scope, $http, $cookieStore, $location, $window, $mdToast){
        $scope.people = 1;
        $scope.loading = false;
        $scope.selected_from = undefined;
        $scope.selected_to = undefined;
        $scope.countries = [];

        $scope.form = {
            from: 'EDI',
            to: 'LHR',
            inbound: (12).days().fromNow(),
            outbound: (7).days().fromNow()
        };

        $scope.buy = function (flight) {
            PopulateDB($scope, $http, $location, flight);
            $window.open(flight.url);
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
                    outbounddate: $scope.form.outbound.toString('yyyy-MM-dd'),
                    inbounddate: $scope.form.inbound.toString('yyyy-MM-dd'),
                    adults: $scope.people,
                    children: 0,
                    locationschema: 'Iata'
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

        $scope.autocomplete = function (field) {
            var query = $scope.from;
            if (field === 'to') {
                query = $scope.to;
            }

            $http({
                url: 'http://www.corsproxy.com/partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GB/GBP/en-GB/?query='+query+'&apikey=ilw27259291653502403180676980633',
                method: 'GET',
                dataType: 'json',
                data: {},
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'SOCIALFLIGHT ' + localStorage.getItem('access_token')
                }
            }).success(function (data, status, headers, config) {
                console.log(data);
                $scope.countries = data;
            }).error(function (data, status, headers, config) {
                $scope.loading = false;
                $scope.registerStatus = status;
                console.log(data);
            });
        }
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
        flight.url = route.PricingOptions[0].DeeplinkUrl;
        flight.price = route.PricingOptions[0].Price;
        flight.outboundlegid = route.OutboundLegId;
        flight.inboundlegid = route.InboundLegId;

        raw.Legs.forEach(function(leg){
            if (leg.Id === route.InboundLegId) {
                flight.duration = leg.Duration;
                flight.inbound = leg.Departure;
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
                flight.outbound = leg.Departure;
            }
        });

        $scope.flights.push(flight);
    });
}

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