angular.module('social-flights.controllers.login', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('loginController', function($scope, $http, $cookieStore, $location, $mdToast){
        function toastIt() {
            $mdToast.show({
                template: '<md-toast>' + $scope.toast + '</md-toast>',
                hideDelay: 2000,
                position: getToastPosition()
            });
            function getToastPosition() {
                return Object.keys($scope.toastPosition)
                    .filter(function(pos) { return $scope.toastPosition[pos]; })
                    .join(' ');
            };
        };

        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.message = 'Login';
        $scope.login={};
        //$scope.login.password = CryptoJS.SHA512($scope.login.password);
        $scope.submit = function()  {
            //auth.login($scope.login);

            var pass = $scope.login.password;
            console.log(pass);
            var hash = CryptoJS.SHA512(pass).toString();
            console.log(hash);

            $http({
                url: backend+"/users/login",
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    email: $scope.login.email,
                    password: hash
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function (data, status, headers, config) {
                if (data.status_code == "200"){
                    $cookieStore.put('access_token', data.data.access_key);
                    $cookieStore.put('user', data.data);
                    $location.path("/profile");
                    $scope.toast = "You have logged in!";

                } else if(data.status_code == "403") {
                    $cookieStore.remove('access_token');
                    $cookieStore.remove('user');
                    $scope.toast = "Incorrect username or password";
                }

                toastIt();

            }).error(function(data, status, headers, config) {
                $scope.toast = "Something went wrong";
                $scope.loginStatus = data.status_code;
            });
        }

    });