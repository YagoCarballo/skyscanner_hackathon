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

         var email = $scope.form.email;
         var first_name = $scope.form.first_name;
         var last_name = $scope.form.last_name;
         var phone = $scope.form.phone;
         var city = $scope.form.city;
         var postcode = $scope.form.postcode;

         var object_to_update = {
             email : email,
             password: hash
         };

         if (first_name) object_to_update.first_name = first_name;
         if (last_name) object_to_update.last_name = last_name;
         if (phone) object_to_update.phone = phone;
         if (city) object_to_update.city = city;
         if (postcode) object_to_update.postcode = postcode;

         $http({
             url: backend+"/users/register",
             method: 'POST',
             dataType: 'json',
             data: JSON.stringify(object_to_update),
             headers: {
                 'Content-Type': 'application/json; charset=utf-8'
             }
         }).success(function (data, status, headers, config) {
             console.log(data);

             if(data.status_code == "200"){
                 localStorage.setItem('access_token', data.data.access_key);
                 localStorage.setItem('user', JSON.stringify(data.data));

                 //$cookieStore.put('access_token', data.data.access_key);

                 $scope.registerSuccess = data.status_code;
                 $location.path("/profile/"+data.data.id);

             } else if(data.status_code == "403") {
                 $scope.registerError = data.status_code;

                 localStorage.removeItem('access_token');
                 localStorage.removeItem('user');

                 //$cookieStore.remove('access_token');
                 //$cookieStore.remove('user');

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
