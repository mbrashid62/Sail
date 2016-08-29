soundcloudApp.controller("TracksController", function ($scope, $window, Tracks, Authentication) {

    $scope.testMsg = "hello from controller";
    $scope.savedTracks = [];

    $scope.initTracks = function () {
        var currentUser = firebase.auth().currentUser;
        if(currentUser == null ){
            $window.location.href = '/#/';
        } else {
            $scope.welcomeMsg = "Saved Tracks";
            $scope.fetchSavedTracks();
        }
    };

    $scope.convertToArray = function (savedTracks) {
        return $.map(savedTracks, function(value) {
            return [value];
        });
    };

    $scope.fetchSavedTracks = function () {
        Tracks.fetchSavedTracks()
            .then(function (savedTracks) {
                var savedTracksArray = $scope.convertToArray(savedTracks);
                $scope.savedTracks = savedTracksArray;
                $scope.$apply();
            });
    };

    $scope.deleteSavedTrack = function (index) {
        Tracks.deleteSavedTrack($scope.savedTracks[index]);
        $scope.savedTracks.splice(index, 1);
    };

    $scope.logOut = function () {
        Authentication.logout();
    };
});


