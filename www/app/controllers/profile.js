angular.module('social-flights.controllers.profile', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('profileController', function($scope, $http, $cookieStore, $mdToast, $location, $routeParams, $mdBottomSheet) {
        $scope.message = 'Profile';
        $scope.user = {
            email : '',
            joined_date : new Date()
        };

        $scope.flights = [];
        $scope.groups = [];

        $scope.user_id = $routeParams.id;
        
        var json_user = localStorage.getItem('user');
        if (json_user) {
            var user = JSON.parse(json_user);
            if (user.id === $scope.user_id) {
                $scope.user = JSON.parse(json_user);
            }
        }

        var json_flights = localStorage.getItem('flights');
        if (json_flights) {
            $scope.flights = JSON.parse(json_flights);
        }

        var json_groups = localStorage.getItem('groups');
        if (json_groups) {
            $scope.groups = JSON.parse(json_groups);
        }

        $scope.formatDate = function (date) {
            return new Date(date).toString('dd-MM-yyyy HH:mm');
        };

        $scope.$$phase || $scope.$apply();
        if(checkAuth(localStorage.getItem('access_token'))) {
            refresh ();

        } else {
            $mdToast.show({
                template: '<md-toast>You must be logged in to access this</md-toast>',
                hideDelay: 3000,
                position: 'top right'
            });
        }

        $scope.showGridBottomSheet = function($event) {
            $mdBottomSheet.show({
                templateUrl: 'views/templates/bottom-grid.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.groupDetails = function (group) {
            $location.path("/group/"+group.id);
        };

        $scope.flightDetails = function (flight) {
            $location.path("/flight/"+flight.id);
        };

        function refresh () {
            fetchProfile($scope, $http, $location);
            fetchGroups($scope, $http, $location);
            fetchFlights($scope, $http, $location);
        }
    })

    .controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet, $mdDialog) {

        $scope.items = [
            { name: 'Add Group', icon: 'fa-plus' }
        ];

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);

            if ($index == 0) {
                $mdDialog.show({
                    templateUrl: 'views/templates/add-group.html',
                    controller: DialogController
                }).then(function() {
                    $scope.alert = 'You said "Okay".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
            }
        };
    });

function DialogController($scope, $mdDialog, $http) {
    $scope.submit = function() {
        addGroup($scope, $http, $mdDialog);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

function fetchProfile ($scope, $http, $location) {
    $http({
        url: backend+"/profile/"+$scope.user_id,
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
            localStorage.setItem('access_token', data.data.access_key);
            localStorage.setItem('user', JSON.stringify(data.data));

            $scope.user = data.data;

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

function fetchGroups ($scope, $http, $location) {
    $http({
        url: backend+"/users/"+$scope.user_id+'/groups',
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
            $scope.groups = data.data;
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
}


function fetchFlights ($scope, $http, $location) {
    $http({
        url: backend+"/users/"+$scope.user_id+'/flights',
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

function addGroup ($scope, $http, $mdDialog, $location) {
    var password = $scope.form.password;
    var hash = CryptoJS.SHA512(password).toString();
    var user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        $http({
            url: backend+"/groups/create",
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                group_name: $scope.form.name,
                password: hash,
                description: $scope.form.description,
                members: [
                    user.id
                ]
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'SOCIALFLIGHT '+localStorage.getItem('access_token')
            }
        }).success(function (data, status, headers, config) {
            console.log(data);

            if(data.status_code == "200"){
                $mdDialog.cancel();

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
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

    }
}