//Create the module
angular.module('social-flights', [
  'ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial',

  // Configuration
  'social-flights.config',

  // Controllers
  'social-flights.controllers.navigation', 'social-flights.controllers.login',
  'social-flights.controllers', 'social-flights.register', 'social-flights.controllers.profile',
  'social-flights.controllers.flights', 'social-flights.controllers.group'
])

  //Configure routes
  .config(function($routeProvider, $httpProvider){

   $httpProvider.defaults.useXDomain = true;
   $httpProvider.defaults.withCredentials = true;

    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider

      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'appController',
        requiresLogin: true
      })

      // Login
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
        requiresLogin: true
      })

      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController',
        requiresLogin: false
      })

      .when('/profile/:id', {
        templateUrl: 'views/profile.html',
        controller: 'profileController',
        requiresLogin: true
      })

      .when('/flights', {
        templateUrl: 'views/flights.html',
        controller: 'flightsController',
        requiresLogin: true
      })

      .when('/group/:id', {
        templateUrl: 'views/group.html',
        controller: 'groupController',
        requiresLogin: true
      })

    // if none of the above states are matched, use this as the fallback
    .otherwise('/');
  })

  .factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'SOCIALFLIGHT ' + $window.sessionStorage.token;
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

//Handles the user auth
function checkAuth(cookie)  {
  if (cookie != null){
    return true;
  }
  return false;
}

