angular.module('social-flights.controllers.profile', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('profileController', function($scope, $http, $cookieStore, $mdToast, $location, $routeParams) {
        $scope.message = 'Profile';
        $scope.user = {
            email : '',
            joined_date : new Date()
        };

        var user_id = $routeParams.id;

        var user = $cookieStore.get('user');
        if (user) {
            $scope.user = user;
        }

        $scope.$$phase || $scope.$apply();
        if(checkAuth($cookieStore.get('access_token'))) {
            $http({
                url: backend+"/profile/"+user_id,
                method: 'GET',
                dataType: 'json',
                data: {},
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'SOCIALFLIGHT '+$cookieStore.get('access_token')
                }
            }).success(function (data, status, headers, config) {
                console.log(data);

                if(data.status_code == "200"){
                    $cookieStore.put('access_token', data.data.access_key);
                    $cookieStore.put('user', data.data);
                    $scope.user = data.data;

                } else if(data.status_code == "403") {
                    $scope.registerError = data.status_code;
                    $cookieStore.remove('access_token');
                    $cookieStore.remove('user');

                    $location.path("/login");

                }

                console.log(data.status_code);

            }).error(function(data, status, headers, config) {
                $scope.registerStatus = status;
                console.log("error");
            });
        } else {
            $mdToast.show({
                template: '<md-toast>You must be logged in to access this</md-toast>',
                hideDelay: 3000,
                position: 'top right'
            });
        }
    });