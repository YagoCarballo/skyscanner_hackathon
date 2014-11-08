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
    .when('/query', {
      templateUrl: 'views/query.html',
      controller: 'queryController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
