angular.module('social-flights.controllers.flights', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('flightsController', function($scope, $http, $cookieStore, $location, $mdToast){
        $scope.people = 1;
        $scope.loading = false;
        $scope.selected = undefined;
        $scope.countries = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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
                    originplace: 'EDI',
                    destinationplace: 'LHR',
                    outbounddate: '2014-11-11',
                    inbounddate: '2014-11-20',
                    adults: 1,
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

function formEncode(obj) {
    var encodedString = '';
    for (var key in obj) {
        if (encodedString.length !== 0) {
            encodedString += '&';
        }

        encodedString += key + '=' + encodeURIComponent(obj[key]);
    }
    return encodedString.replace(/%20/g, '+');
}

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

        $scope.flights = data.data;
        console.log(data);

    }).error(function (data, status, headers, config) {
        $scope.loading = false;
        $scope.registerStatus = status;
        console.log(data);
    });
}

function parseFlights (raw) {
    raw.Itineraries.each(

    );
}