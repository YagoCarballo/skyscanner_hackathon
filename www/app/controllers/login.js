angular.module('social-flights.controllers.login', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('loginController', function($scope, $cookies, $location, $mdToast){
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
            $.ajax({
                type: "POST",
                url: "http://localhost/Backend/login",
                data: JSON.stringify({username: $scope.login.username, password: hash}),
                //5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
                dataType: "JSON"
            }).done(function(data){

                $scope.status=data.status;
                $scope.access_token = data.access_token;
                //console.log(JSON.stringify(data, null, 5));
                //alert(JSON.stringify(data, null, 4));
            }).error(function(data){
                $scope.toast = "Something went wrong";
                $scope.loginStatus = data.status;
                //should delete cookie
            }).success(function(data){
                if(data.status == "200"){
                    $cookies.monster_cookie = data.user[0].access_token;
                    $scope.toast = "You have logged in!";
                } else if(data.status == "403") {
                    $scope.toast = "Incorrect username or password";
                }
                toastIt();
                $scope.$apply();
            });
        }

    });