soundcloudApp.controller("RegistrationController", function ($scope, $window, Authentication) {

    $scope.initLanding = function () {
        Authentication.isUserLoggedIn();
    };

    $scope.login = function () {
        Authentication.login($scope.user);
    };

    $scope.register = function () {
        Authentication.register($scope.user);
    };

    $scope.navToExplore = function () {
        $window.location.href = '/#/explore';
    };
});