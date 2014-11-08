'use strict';

angular.module('social-flights.register', ['ngRoute', 'ngCookies', 'social-flights.config'])

    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController',
      requiresLogin: true
    })
    }])

    .controller('registerController', function($scope, $http, $cookieStore, $location){
     $scope.message="Register";
     $scope.submit = function(){
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

             if(data.status_code == "200"){
                 $cookieStore.put('access_token', data.data.access_key);
                 $scope.registerSuccess = data.status_code;
                 $location.path("/profile");

             } else if(data.status_code == "403") {
                 $scope.registerError = data.status_code;
                 $cookieStore.remove('access_token');
                 $cookieStore.remove('user');

             }  else if (data.status_code == "409"){
                 $scope.formError = data.status_code + " - Email already exists.";
             }

             console.log(data.status_code);

         }).error(function(data, status, headers, config) {
             $scope.registerStatus = status;
             console.log("error");
         });
     }
    });
