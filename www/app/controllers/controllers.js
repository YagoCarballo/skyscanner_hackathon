angular.module('social-flights.controllers', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial'])

    .controller('logoutController', function($cookies, $scope)  {
        var cookie = $cookies.monster_cookie;
        if(cookie != null) {
            console.log("attempted logout");
            document.cookie = 'monster_cookie' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            //$cookies.remove('monster_cookie');
        } else {
            console.log("already logged out");
        }
    })

    .controller('countriesController', function($scope){
        $scope.message = 'Countries!';
        $.ajax({
            type: "get",
            url: "https://zeno.computing.dundee.ac.uk/2014-ac32006/yagocarballo/?__route__=/countries",
        }).done(function(data){
            //console.log(data);
            console.log("done");
        }).fail(function(data){
            //delete $window.sessionStorage.token;
        }).success(function(data){
            $scope.countries = data.countries;
            //console.log(JSON.stringify(data, null, 5));
        });
    })

    .controller('cpController', function($scope){

    })

    .controller('appController', function($scope, $cookies, $location, $timeout, $mdSidenav){


        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
    })

    .controller('aboutController', function($scope){
        $scope.message = 'About';
        $.ajax({
            type: "get",
            url: "http://localhost/Backend/",
            //header: {monster_cookie: $cookies.monster_cookie},
            //beforeSend: function(xhr){xhr.setRequestHeader('monster_token',myCookie );},
            //5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
            success: console.log("yay"),//$scope.status = data.status,
        }).done(function(data){
            console.log(data);
            console.log("done");
        }).fail(function(data){
            //delete $window.sessionStorage.token;
            console.log("failed to get about data");
        }).success(function(data){
            $scope.profile = data.message;
            $scope.module = data.module;
            $scope.team = data.team;
            $scope.version = data.version;
            $scope.members = data.members;
            console.log(JSON.stringify(data, null, 5));
            $scope.$apply();
        });
    })

    .controller('contactController', function($scope){
        $scope.message = 'Contact';
    })

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

    })

    .controller('ToastCtrl', function($scope, $mdToast) {
        $scope.closeToast = function() {
            $mdToast.hide();
        };
    })

    .controller('profileController', function($scope, $cookies, $mdToast, $location) {
        $scope.message = 'Profile';

        $scope.$$phase || $scope.$apply();
        if(checkAuth($cookies.monster_cookie)) {
            $.ajax({
                type: "get",
                url: "http:/Backend/profile/userid",
                beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
            }).done(function(data){
                console.log(data);
                console.log("done");
            }).fail(function(data){
                console.log("Error fetching profile info");
            }).success(function(data){
                $scope.profileUsername = data[0].username;
                $scope.profileGroup = data[0].group_name;
                console.log(JSON.stringify(data, null, 5));
                console.log("yay success " + data.status);
                console.log(data[0].username);
                $scope.$apply();
            });
        } else {


            $mdToast.show({
                template: '<md-toast>You must be logged in to access this</md-toast>',
                hideDelay: 3000,
                position: 'top right'
            });
            $location.path("/");

        }
    })

    .controller('TypeaheadCtrl', function($scope) {

        $scope.selected = undefined;
    })

    .controller('AppCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };
    })

    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.close = function() {
            $mdSidenav('left').close();
        };
    })

    .controller('RightCtrl', function($scope, $timeout, $mdSidenav) {
        $scope.close = function() {
            $mdSidenav('right').close();
        };
    });