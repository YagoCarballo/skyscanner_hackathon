angular.module('social-flights.controllers', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])

    .controller('countriesController', function($scope){
        $scope.message = 'Countries!';
        $.ajax({
            type: "get",
            url: "https://zeno.computing.dundee.ac.uk/2014-ac32006/yagocarballo/?__route__=/countries"
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
            success: console.log("yay")//$scope.status = data.status,
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

    .controller('ToastCtrl', function($scope, $mdToast) {
        $scope.closeToast = function() {
            $mdToast.hide();
        };
    })

    .controller('TypeaheadCtrl', function($scope) {

        $scope.selected = undefined;
    });