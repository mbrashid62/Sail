
soundcloudApp.factory('Authentication', function ($rootScope, $window, Firebase, FIREBASE_URL) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User: ' + user.email + '  is signed in.');
            if ($window.location.hash == '#/tracks') { // if user is refreshing from tracks view
                $window.location.href = '/#/tracks';
            } else {
                debugger;
                $window.location.href = '/#/explore';
            }
        } else {
            console.log('User is signed out');
            $window.location.href = '/#/';
        }
    });

    return {
        isUserLoggedIn: function () {
            if (firebase.auth().currentUser !== null) { // if user is logged in
                $window.location.href = '/#/explore';
            }
        },

        login: function (user) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(function (response) {
                    $window.location.href = '/#/explore';
                }).catch(function (error) {
                    $window.location.href = '/#/error';
                    return error;
                });
        },

        logout: function () {
            firebase.auth().signOut()
                .then(function () {
                    alert('Sign out successful!');
                    $window.location.href = '/#/';
                }, function (error) {
                    $window.location.href = '/#/error';
                    alert('There was an error signing out:' + error);

                });
        },

        register: function (user) {

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(function (registeredUser) {

                    var db = firebase.database();
                    var userData = { email: registeredUser.email, tracks: { } };
                    db.ref("users").push(userData);
                    // db.ref("tracks").push({
                    //     email: registeredUser.email
                    // });

                    $rootScope.message = "Hi " + user.firstname + ", thanks for registering.";


                }).catch(function (error) {
                    var errorCode = error.code;
                    $rootScope.message = error.message;
                    console.log('Error Code: ' + errorCode + ' Error message' + error.message);
            });
        }
    }

});


