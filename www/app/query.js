'use strict';

angular.module('clientApp.query', ['ngRoute', 'ngCookies', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/query', {
    templateUrl: 'views/query.html',
    controller: 'queryController'
  });
}])


//http://localhost/Backend/countries
.factory('queryService', function($http){
  return {
    getCountries: function(callback){
      return $http.get('http://localhost/Backend/countries').success(callback);
     }
   }
})

.controller('queryController', function($scope, $cookies, queryService, $mdToast, $location) {
  if (checkAuth($cookies.monster_cookie)){
  console.log("hey query");
    $scope.message="Query";
    queryService.getCountries(function(data)  {
      $scope.countries = data.countries;
    })
  } else {
    $mdToast.show({
      template: '<md-toast>You must be logged in to access this</md-toast>',
      hideDelay: 3000,
      position: 'top right'
    });
    $location.path("/");
  };

});
