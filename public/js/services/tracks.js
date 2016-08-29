soundcloudApp.factory('Tracks', function () {

    return {
        fetchTrack: function (genreSelected) {
            return new Promise (function (resolve, reject) {
                SC.get('/tracks', { genres: genreSelected, streamable: true }) // sc api request
                    .then(function (tracks) {
                        resolve(tracks[Math.floor(Math.random() * tracks.length)]); // pick a random track
                    });
            });
        },

        getPlayer: function (track) {
            debugger;
            var trackPath = '/tracks/' + track.id;
            return new Promise(function (resolve, reject) {
                SC.stream(trackPath)
                    .then(function(player) {
                        resolve(player); // player.play();
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
        },

        saveTrack: function (track) {
            var userId = firebase.auth().currentUser.uid;
            var db = firebase.database();
            var newTrackKey = db.ref().child('tracks').push().key;
            var dataToSave = {
                trackTitle: track.title,
                trackGenre: track.genre,
                trackArt: track.artwork_url,
                trackLikes:track.likes_count,
                trackComments: track.comment_count,
                trackPlays: track.playback_count,
                trackLink: track.permalink_url,
                trackId: newTrackKey
            };
            var updates = {};
            updates['/tracks/' + userId + '/' + newTrackKey] = dataToSave;
            db.ref().update(updates);
            alert('You just saved ' + track.title + '!' +' You may now visit Your Tracks to view it at any time.');
            console.log('Just saved: ' + track.title + ' to the database.');
        },

        fetchSavedTracks: function () {
            var userId = firebase.auth().currentUser.uid;
            var db = firebase.database();
            return new Promise(function (resolve, reject) {
                db.ref('/tracks/' + userId).once('value')
                    .then(function (snapshot) {
                        resolve(snapshot.val());
                    })
            });
        },

        deleteSavedTrack: function (track) {
            var trackId = track.trackId;
            var userId = firebase.auth().currentUser.uid;
            var db = firebase.database();
            var updates = {};
            updates['/tracks/' + userId + '/' + trackId] = null;
            db.ref().update(updates);
            alert('You just deleted ' + track.trackTitle + '!' +' It will no longer be visible in Your Tracks.');
            console.log('Just deleted: ' + track.trackTitle + ' from the database.');
        }
    }
});
