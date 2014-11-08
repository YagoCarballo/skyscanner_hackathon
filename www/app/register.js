'use strict';

angular.module('clientApp.register', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/register', {
  templateUrl: 'views/register.html',
  controller: 'registerController',
  requiresLogin: true
})
}])
client.controller('registerController', function($scope, $cookies, $location){
 $scope.message="Register";
 $scope.submit = function(){
     console.log($scope.form);
     var password = $scope.form.password;

   var hash = CryptoJS.SHA512(password).toString();
   $.ajax({
     type:"POST",
     url: "http://localhost/Backend/register",
     //beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
     data: JSON.stringify({username: $scope.form.username, password: hash}),
     success: console.log(JSON.stringify({username: $scope.form.username, password: hash})),//$scope.status = data.status,
     dataType: "JSON"

   }).done(function(data){
        console.log("done");
     //$scope.status=data.status;
     //$scope.message=data.message;

   }).error(function(data){
     //console.log("oh it failed " + data.status);
     $scope.registerStatus = data.status;
       console.log("error");
     }).success(function(data){
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
   });
 }
});
