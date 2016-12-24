
soundcloudApp.factory('Authentication', function ($rootScope, $window, Firebase, FIREBASE_URL) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.email + ' is now logged in.');
            if ($window.location.hash == '#/tracks') { // if user is refreshing from tracks view
                $window.location.href = '/#/tracks';
            } else {
                $window.location.href = '/#/explore';
            }
        } else {
            console.log('No user is currently logged in');
            $window.location.href = '/#/';
        }
    });

    var isUserLoggedIn = function () {
        return firebase.auth().currentUser !== null
    };

    return {
        initLanding: function () {
            if (isUserLoggedIn()) {
                $window.location.href = '/#/explore';
            }
        },

        login: function (user) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(function (response) {
                    console.log(user.email + ' logged in successfully.');
                    $rootScope.errorMessage = '';
                    $window.location.href = '/#/explore';
                }).catch(function (error) {
                    console.log('Error code: ' + error.code);
                    $rootScope.errorMessage = error.message;
                    $rootScope.$apply();
                });
        },

        logout: function () {
            firebase.auth().signOut()
                .then(function () {
                    alert('Sign out successful!');
                    $window.location.href = '/#/';
                }, function (error) {
                    $window.location.href = '/#/error';
                    console.log('Error logging out: ' + error.message);
                });
        },

        register: function (user) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(function (registeredUser) {
                    var db = firebase.database();
                    var userData = { email: registeredUser.email, tracks: { } };
                    db.ref("users").push(userData);
                    $rootScope.registrationErrorMessage= '';
                    $rootScope.registrationErrorCode= '';
                    console.log(user.email + ' successfully registered');
                }).catch(function (error) {
                $rootScope.registrationErrorMessage = error.message;
                console.log('Registration error code:' + error.code);
                $rootScope.$apply();
            });
        }
    }
});


