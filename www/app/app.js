//Create the module
var client = angular.module('social-flights', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial', 'social-flights.controllers', 'social-flights.query', 'social-flights.register']);

//Configure routes
client.config(function($routeProvider, $httpProvider){

 $httpProvider.defaults.useXDomain = true;
 $httpProvider.defaults.withCredentials = true;

  $httpProvider.interceptors.push('authInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'appController',
      requiresLogin: true
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'aboutController',
      security: true
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'contactController',
      requiresLogin: true
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginController',
      requiresLogin: true
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'profileController',
      requiresLogin: true
    })
    .when('/controlpanel', {
      templateUrl: 'views/controlpanel.html',
      controller: 'cpController',
      security: true
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController',
      requiresLogin: true
    })
    .when('/countries', {
      templateUrl: 'views/countries.html',
      controller: 'countriesController'
    })
    .when('/logout', {
      templateUrl: 'views/home.html',
      controller: 'logoutController'
    })

  // if none of the above states are matched, use this as the fallback
  .otherwise('/');
});


//Auth



client.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});





//Directives



//Controllers



//Handles the user auth
function checkAuth(cookie)  {
  if (cookie != null){
    return true;
  }
  return false;
}
