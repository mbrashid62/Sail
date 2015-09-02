/**
 * Created by billrashid on 5/24/15.
 */

$(function(){

    var $tracksTable = $('#TracksTable').hide();
    var $addButton = $('#AddTrackButton').hide();
    var $genreSelect = $('#GenresSelect');
    var $play_pause_btn = $('#Play').hide();
    var track_to_play;
    var sound_being_played;
    var is_track_playing = false;

    /*****Get permission to use SoundCloud API*********/
    window.onload = function(){
        SC.initialize({
            client_id: '0daca8243d9f39939ef509e9124b7676'
        });
    };

    $($genreSelect).on('change', function(e){
        $tracksTable.show();
        $addButton.show();
    });

    var getTrackInfo = function(track){
        return {
            "genre": track.genre,
            "title": track.title,
            "duration": track.duration,
            "download_count": track.download_count,
            "playback_count": track.playback_count,
            "favoritings_count": track.favoritings_count,
            "purchase_url": track.purchase_url,
            "id": track.id
        };
    };

    var addToResultsArray = function(this_track, results_array){

        results_array.push(new TrackResult(this_track.genre, this_track.title, this_track.duration, this_track.download_count, this_track.playback_count, this_track.favoritings_count, this_track.purchase_url, this_track.id));
    };

    var handle_add_track = function(genreSelected, results_array){

        //creates a promise
        var track_promise = new Promise(function(resolve, reject) {

            var this_track = null;
            var has_received_track = false;

            // perform an async request and then resolve/reject.
            SC.get('/tracks', {genres: genreSelected, streamable: true},

                //Get tracks arr from SC and then get a random track from arr
                function (tracksArr) {
                    var random = Math.floor(Math.random() * 9);
                    this_track = getTrackInfo(tracksArr[random]);
                    has_received_track = true;

                    if (has_received_track) {
                        resolve("Promise was resolved!");
                        addToResultsArray(this_track, results_array);
                    }
                    else {
                        reject(Error("Promise was rejected"));
                    }
                });
        });
    };

    /******Knockout ViewModel*********/
    var viewModel = function () {

        var viewModel = this;
        this.resultsArray = ko.observableArray([]);

        viewModel.addTrack = function () {

            if($genreSelect.val() != 'Pick a Genre'){
                var genreSelected = $genreSelect.val();
                handle_add_track(genreSelected, viewModel.resultsArray);
            }

            else{alert('Pick an actual genre');}
        },

        viewModel.removeTrack = function (track){
            viewModel.resultsArray.remove(track);
        },

        viewModel.getSound = function(track){

            var track_path = '/tracks/' + track.id;
            var handleStreaming = function(viewModel){

                console.log('Streaming is Ready');
                try{
                        SC.stream(track_path, function(sound){
                        sound_being_played = sound;
                        viewModel.togglePause(sound);
                        is_track_playing = true;
                    });
                }
                catch(e){
                    console.log('Error in Streaming: ' + e);
                }
            };

            if(is_track_playing == false){
                SC.whenStreamingReady(handleStreaming(viewModel));
            }
            else{
                sound_being_played.pause();
                is_track_playing = false;
            }

        },

        viewModel.togglePause = function (sound) {
            console.log('In togglePause');
            sound.togglePause();
        },

        viewModel.hoverRow = function(data, event){
            var el = $(event.target.parentElement);
            el.css("backgroundColor", "black");

        },

        viewModel.leaveRow = function(data, event){
            var el = $(event.target.parentElement);
            el.css("backgroundColor", "");
        }

    };

    ko.applyBindings(new viewModel());

    //class to represent a track result returned from soundcloud API
    function TrackResult (genre, title, duration, download_count, playback_count, favoritings_count, purchase_url, id){

        var self = this;
        self.genre = genre;
        self.title = title;
        self.duration = duration;
        self.download_count = download_count;
        self.playback_count = playback_count;
        self.favoritings_count = favoritings_count;
        self.purchase_url = purchase_url;
        self.id = id;

    }

});


