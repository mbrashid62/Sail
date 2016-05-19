/**
 * Created by billrashid on 5/24/15.
 */

$(function(){

    var $dashboard = $('#dashboard').hide();
    var $genreSelect = $('#genres-select');
    var $customForm = $('#custom-genre-form').hide();
    var $customInput = $('#custom-genre');
    var $headerText = $('#header-text');
    var $introText = $('#intro-text');
    var $bodyWrapper = $('#body-wrapper');

    //hide els for animation
    $introText.css("opacity", "0.0");
    $bodyWrapper.css("opacity", "0.0");


    var animateHeader = function(){
        $headerText.addClass('animated zoomIn');
        $introText.css("opacity", "1.0");
        $introText.addClass('animated zoomIn');
    };


    var animateBody = function () {
        $bodyWrapper.css("opacity", "1.0");
        $bodyWrapper.addClass('animated fadeIn');
    };

    //chain animation functions
    animateHeader();
    $introText.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', animateBody);


    /*****Get permission to use SoundCloud API*********/
    window.onload = function(){
        SC.initialize({
            client_id: '0daca8243d9f39939ef509e9124b7676'
        });

    };

    /******Knockout ViewModel*********/
    var viewModel = function () {

        var view_model = this;
        this.track_playlist = ko.observableArray([]);    //array to store tracks from SC

        view_model.is_playing = false;
        view_model.sc_player = null;
        view_model.track_playing = null;
        view_model.track_for_dash = null;


        view_model.show_table_and_button = function(){

            if($genreSelect.val() == 'Custom')
                $customForm.show();
            else
                $customForm.hide();
        },

        view_model.add_track = function () {
            var genre_selected = $genreSelect.val();
            if($genreSelect.val() == 'Choose a Genre')
                alert('Pick an actual genre');

            else if($genreSelect.val() == 'Custom')
                view_model.handle_add_track($customInput.val());

            else
                view_model.handle_add_track(genre_selected);

        },

        view_model.handle_add_track = function(genreSelected){

            var this_track = null;
            var has_received_track = false;
            SC.get('/tracks', {genres: genreSelected, streamable: true}).then(

                function(tracks_response_array){
                    //debugger;
                    //console.log("Genre: " + genreSelected + " | " + "num_results: " + tracks_response_array.length);
                    this_track = tracks_response_array[Math.floor(Math.random() * tracks_response_array.length)]; //select a random track from the array
                    has_received_track = true;
                    view_model.track_for_dash = this_track;
                    if (has_received_track) {
                        console.log("Track has been fetched.");
                        view_model.addToResultsArray(this_track);
                    }
                    else {
                        console.log("Error in fetching track.");
                    }

                    console.log("playlist: " + view_model.track_playlist);
                    debugger;
                }

            );

        },

        view_model.addToResultsArray = function(this_track){
            view_model.track_playlist.push(this_track);
        };

        view_model.removeTrack = function (track){
            view_model.track_playlist.remove(track);
        },

        view_model.handleClick = function(trackClicked){

            view_model.track_for_dash  = trackClicked;

            //if a track is playing and the user clicked that track- pause it
            if(view_model.is_playing && (trackClicked == view_model.track_playing)){
                view_model.sc_player.pause();
                view_model.is_playing = false;
            }

            //if a track is playing and the user clicked a different track other than the one playing - pause the one playing and play the one that the user clicked
            else if(view_model.is_playing && (trackClicked != view_model.track_playing)){

                view_model.sc_player.pause();
                view_model.getSoundAndStream(trackClicked);
            }

            //if no track is playing - play the track that was clicked
            else if(!view_model.is_playing){
                view_model.getSoundAndStream(trackClicked);
            }

        },

        //gets sound from soundcloud, begins streaming sound, and assigns sound to view_model.
        view_model.getSoundAndStream = function(trackClicked){

            var track_path = '/tracks/' + trackClicked.id;

            SC.stream(track_path).then(function(player){

                debugger;
                //assign sound obj to viewmodel
                view_model.sc_player = player;
                //play sound obj
                view_model.sc_player.play();


                //assign track being played to view model
                view_model.track_playing = trackClicked;
                //notify viewmodel track is being played
                view_model.is_playing = true;
                //update dash
                view_model.displayDash();
            });

        },

        view_model.displayDash = function(){

            $dashboard.show();
            var art_img = $('#artwork_img');

            if(view_model.track_for_dash.artwork_url){
                art_img.attr("src", view_model.track_for_dash.artwork_url);
            }
            else{
                art_img.attr("src", '');
            }

            //track data
            var title = $('#track-title').html(view_model.track_for_dash.title);
            var likes = $('#track-likes').html(view_model.track_for_dash.likes_count);
            var comments = $('#track-comments').html(view_model.track_for_dash.comment_count);
            var plays = $('#track-playbacks').html(view_model.track_for_dash.playback_count);
            var link = $('#track-link').attr("href", view_model.track_for_dash.permalink_url);

        };

        //TODO fix
        //view_model.hoverRow = function(data, event){
        //    var el = $(event.target.parentElement);
        //    el.addClass('animated infinite pulse');
        //},
        //
        //view_model.leaveRow= function(data, event){
        //    var el = $(event.target.parentElement);
        //    el.removeClass('animated infinite pulse');
        //};

    };

    ko.applyBindings(new viewModel());
});


