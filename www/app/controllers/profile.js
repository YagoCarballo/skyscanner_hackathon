angular.module('social-flights.controllers.profile', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.config'])
    .controller('profileController', function($scope, $cookies, $mdToast, $location) {
        $scope.message = 'Profile';

        $scope.$$phase || $scope.$apply();
        if(checkAuth($cookies.monster_cookie)) {
            $.ajax({
                type: "get",
                url: backend+"/profile/",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)
                }
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
    });