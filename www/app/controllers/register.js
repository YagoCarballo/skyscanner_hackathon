'use strict';

angular.module('social-flights.register', ['ngRoute', 'ngCookies', 'social-flights.config'])

    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController',
      requiresLogin: true
    })
    }])

    .controller('registerController', function($scope, $http, $cookies, $location){
     $scope.message="Register";
     $scope.submit = function(){
         console.log($scope.form);
         var password = $scope.form.password;

         var hash = CryptoJS.SHA512(password).toString();

         $http({
             url: backend+"/users/register",
             method: 'POST',
             dataType: 'json',
             data: JSON.stringify({
                 email: $scope.form.email,
                 password: hash
             }),
             headers: {
                 'Content-Type': 'application/json; charset=utf-8'
             }
         }).success(function (data, status, headers, config) {
             console.log(data);

             if(data.status == "200"){
                 $scope.registerSuccess = data.status;
                 $scope.$apply(function() { $location.path("/login"); });

             } else if(data.status == "403") {
                 $scope.registerError = data.status;

             }  else if (data.status == "409"){
                 $scope.formError = data.status + " - Username already exists.";
             }

             $scope.$apply();
             console.log(data.status);

         }).error(function(data, status, headers, config) {
             $scope.registerStatus = data.status;
             console.log("error");
         });
     }
    });
