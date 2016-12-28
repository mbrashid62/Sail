soundcloudApp.controller("ExploreController", function ($scope, $window, Tracks, Authentication) {

    $scope.listOfGenres = ['80\'s', 'Rock', 'SynthPop', 'Indie', 'Jpop', 'Folk', 'Baroque', 'House', 'Soul', 'Hip-Hop', 'Electronic', 'Country', 'Classical', 'RnB', 'Pop'];
    $scope.fetchedTracks = Tracks.getFetchedTracks();
    $scope.isPlaying = false;
    $scope.playingTrackTitle = '';
    $scope.isDashShown = false;


    var updateDashBoard = function (track) {
        $scope.playingTrackTitle = track.title;
        $scope.$apply();
    };

    $scope.initExplore = function () {
        var currentUser = firebase.auth().currentUser;
        if(currentUser == null ){
            $window.location.href = '/#/';
        } else {
            $scope.welcomeMsg = "Welcome, " + currentUser.email + "!";
        }
    };

    $scope.fetchTrack = function () {

        Tracks.fetchTrack($scope.selectedGenre) // creates a promise
            .then(function (trackAdded) {
                $scope.fetchedTracks = Tracks.getFetchedTracks();
                $scope.errorMessage = '';
                $scope.$apply(); // lets angular know DOM needs to update after AJAX request
            }).catch(function (errorMsg) {
                $scope.errorMessage = errorMsg;
                $scope.$apply();
        });
    };

    $scope.removeTrack = function (index) {
        $scope.fetchedTracks.splice(index, 1);
    };

    $scope.showPlayer = function (index) {
        var trackSelected = $scope.fetchedTracks[index];
        Tracks.showPlayer(trackSelected);
        // $scope.isPlaying = true; // todo: can come in handy later for animations
        $scope.isDashShown = true;
        updateDashBoard(trackSelected);
    };

    $scope.saveTrack = function (index) {
        Tracks.saveTrack($scope.fetchedTracks[index]);
    };

    $scope.logOut = function () {
      Authentication.logout();
    };
});
