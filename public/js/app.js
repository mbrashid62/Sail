var soundcloudApp = angular.module('soundcloudApp', ['ngRoute', 'firebase'])
    .constant('FIREBASE_URL', 'https://soundcloud-app-23eed.firebaseio.com/');

soundcloudApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/landing.html',
            controller: 'RegistrationController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
        })
        .when('/explore', {
            templateUrl: 'views/explore.html',
            controller: 'ExploreController'
        })
        .when('/tracks', {
            templateUrl: 'views/tracks.html',
            controller: 'TracksController'
        })
        .when('/error', {
           templateUrl: 'views/error.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

