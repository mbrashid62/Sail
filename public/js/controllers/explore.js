soundcloudApp.controller("ExploreController", function ($scope, $window, Tracks, Authentication) {

    $scope.listOfGenres = ['80\'s', 'Rock', 'Synthpop', 'Indie', 'Jpop', 'Folk', 'Baroque', 'House', 'Hip-Hop'];
    $scope.fetchedTracks = [];
    $scope.isPlaying = false;
    $scope.playingTrackTitle = '';
    $scope.playingTrackLikes = null;
    $scope.playingTrackPlaybacks = null;
    $scope.playingTrackComments = null;
    $scope.playingTrackPermalink = null;
    $scope.player = {};

    var updateDashBoard = function (track) {
        $scope.playingTrackTitle = track.title;
        $scope.playingTrackLikes = track.likes_count;
        $scope.playingTrackPlaybacks = track.playback_count;
        $scope.playingTrackComments = track.comment_count;
        $scope.playingTrackPermalink = track.permalink_url;
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
            .then(function (track) {
                $scope.fetchedTracks.push(track);
                $scope.$apply(); // lets angular know DOM needs to update after AJAX request
            });
    };

    $scope.removeTrack = function (index) {
        $scope.fetchedTracks.splice(index, 1);
    };

    $scope.getPlayer = function (index) {
        var trackToToggle = $scope.fetchedTracks[index];
        Tracks.getPlayer(trackToToggle)
            .then(function (player) {
                debugger;
                $scope.player = player;
                // $scope.player.initAudio.then(function (something) {
                //     debugger;
                //     something.play();
                // });
                // $scope.player.play();
                $scope.isPlaying = true;
                $scope.isDash = true;
                updateDashBoard(trackToToggle);
            });
    };

    $scope.pauseTrack = function () {
        debugger;
        $scope.player.pause();
        $scope.isPlaying = false;
    };

    $scope.saveTrack = function (index) {
        Tracks.saveTrack($scope.fetchedTracks[index]);
    };

    $scope.logOut = function () {
      Authentication.logout();
    };
});
