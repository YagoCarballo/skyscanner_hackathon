var backend = 'https://social-flights.herokuapp.com';

angular.module('social-flights.config', [])

    .factory('Configuration', function() {
        return {
            backend: backend
        }
    });