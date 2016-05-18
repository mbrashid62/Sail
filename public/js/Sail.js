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

        var viewModel = this;
        //array to store tracks from SC
        this.resultsArray = ko.observableArray([]);

        viewModel.isPlaying = false;
        viewModel.scPlayer = null;
        viewModel.trackPlaying = null;
        viewModel.track_for_dash = null;


        viewModel.showTableAndButton = function(){

            if($genreSelect.val() == 'Custom')
                $customForm.show();
            else
                $customForm.hide();
        },

        viewModel.addTrack = function () {
            var genreSelected = $genreSelect.val();
            if($genreSelect.val() == 'Choose a Genre')
                alert('Pick an actual genre');

            else if($genreSelect.val() == 'Custom')
                viewModel.handle_add_track($customInput.val());

            else
                viewModel.handle_add_track(genreSelected);

        },

        viewModel.handle_add_track = function(genreSelected){

            var this_track = null;
            var has_received_track = false;
            SC.get('/tracks', {genres: genreSelected, streamable: true}).then(

                function(tracksArr){
                    debugger;
                    var random = Math.floor(Math.random() * tracksArr.length);
                    this_track = tracksArr[random];
                    has_received_track = true;
                    viewModel.track_for_dash = this_track;
                    if (has_received_track) {
                        console.log("Track has been fetched.");
                        viewModel.addToResultsArray(this_track);
                    }
                    else {
                        console.log("Error in fetching track.");
                    }
                }

            );

        },

        viewModel.addToResultsArray = function(this_track){
            viewModel.resultsArray.push(this_track);
        };

        viewModel.removeTrack = function (track){
            viewModel.resultsArray.remove(track);
        },

        viewModel.handleClick = function(trackClicked){

            viewModel.track_for_dash  = trackClicked;

            //if a track is playing and the user clicked that track- pause it
            if(viewModel.isPlaying && (trackClicked == viewModel.trackPlaying)){
                viewModel.scPlayer.pause();
                viewModel.isPlaying = false;
            }

            //if a track is playing and the user clicked a different track other than the one playing - pause the one playing and play the one that the user clicked
            else if(viewModel.isPlaying && (trackClicked != viewModel.trackPlaying)){

                viewModel.scPlayer.pause();
                viewModel.getSoundAndStream(trackClicked);
            }

            //if no track is playing - play the track that was clicked
            else if(!viewModel.isPlaying){
                viewModel.getSoundAndStream(trackClicked);
            }

        },

        //gets sound from soundcloud, begins streaming sound, and assigns sound to viewModel.
        viewModel.getSoundAndStream = function(trackClicked){

            var track_path = '/tracks/' + trackClicked.id;

            /*
            SC.stream(, function(player){

                debugger;
                player. play();
                debugger;
            });*/

            SC.stream(track_path).then(function(player){

                debugger;
                //assign sound obj to viewmodel
                viewModel.scPlayer = player;
                //play sound obj
                viewModel.scPlayer.play();


                //assign track being played to view model
                viewModel.trackPlaying = trackClicked;
                //notify viewmodel track is being played
                viewModel.isPlaying = true;
                //update dash
                viewModel.displayDash();
            });

            /*
            var handleStreaming = function(viewModel){
                console.log('Streaming is Ready');

                debugger;
                try{
                        SC.stream(track_path).then( function(sound){
                            //assign sound obj to viewmodel
                            viewModel.scPlayer = sound;
                            //play sound obj
                            viewModel.scPlayer.play();
                            //assign track being played to view model
                            viewModel.trackPlaying = trackClicked;
                            //notify viewmodel track is being played
                            viewModel.isPlaying = true;
                            //update dash
                            viewModel.displayDash();

                    });
                }
                catch(e){
                    console.log('Error in Streaming: ' + e);
                }
            };*/

           // SC.whenStreamingReady(handleStreaming(viewModel));

        },

        viewModel.displayDash = function(){

            $dashboard.show();
            var art_img = $('#artwork_img');

            if(viewModel.track_for_dash.artwork_url){
                art_img.attr("src", viewModel.track_for_dash.artwork_url);
            }
            else{
                art_img.attr("src", '');
            }

            //track data
            var title = $('#track-title').html(viewModel.track_for_dash.title);
            var likes = $('#track-likes').html(viewModel.track_for_dash.likes_count);
            var comments = $('#track-comments').html(viewModel.track_for_dash.comment_count);
            var plays = $('#track-playbacks').html(viewModel.track_for_dash.playback_count);
            var link = $('#track-link').attr("href", viewModel.track_for_dash.permalink_url);

        };

        //TODO fix
        //viewModel.hoverRow = function(data, event){
        //    var el = $(event.target.parentElement);
        //    el.addClass('animated infinite pulse');
        //},
        //
        //viewModel.leaveRow= function(data, event){
        //    var el = $(event.target.parentElement);
        //    el.removeClass('animated infinite pulse');
        //};

    };

    ko.applyBindings(new viewModel());
});


