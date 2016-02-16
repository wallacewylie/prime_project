var app = angular.module('musicApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController'
        })
        .when('/artist', {
            templateUrl: 'views/artist.html',
            controller: 'ArtistController'
        })
        .when('/database', {
            templateUrl: 'views/database.html',
            controller: 'DatabaseController'
        })
        .when('/fail', {
            templateUrl: 'views/fail.html',
            controller: 'FailController'
        })
        .when('/empty', {
        templateUrl: 'views/empty.html',
        controller: 'EmptyController'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', 'artistService', '$location',
    function($scope, $http, artistService, $location) {
    $scope.intro = {
        question: 'What is Realm of Dusk?',
        paragraph: "Realm of Dusk is a website that helps you approach music with the help of a trusty guide. " +
        "It can be dangerous out there, and if you're not careful you could find yourself lost in a twilight " +
        "world of mediocrity and confusion. Look ahead friend! My torch is lit. Let the adventure begin."
    };
    $scope.spin = {
        icon: "https://www.casinobum.com/files/includes/images/images-wheel1.png"
    };


    $scope.getInfo = function () {
        $http({
            method: 'GET',
            url: 'http://ws.audioscrobbler.com/2.0/' + '?' + 'method=artist.getinfo&' +
            'artist=' + $scope.searchBox + '&' +
            'api_key=d3547c51a237e9e26fcdba8e4d4a97ce&' +
            'format=json'
        }).then(function (response) {
            if (response.data.error == 6){
                $location.path('/empty');
            } else {
                var artist = response.data;
                artist.image = artist.artist.image[3]['#text'];
                console.log(artist, "Yo");
                artistService.setCurrentArtist(artist);
                artist.name = artist.artist.name;
                $location.path('/database');
            }
        }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

        });

    };


//function to make sure the wheel doesn't spin until clicked
    $scope.toSpin = false;

    $scope.changeClass = function () {
        if ($scope.toSpin === false) {
            return "image-stationary";
        } else {
            return "image-to-spin";
        }

    };


// function to pick random artist from my database
    randomArtist = function (array) {
        var x = Math.floor(Math.random() * (array.length - 1));
           var artist = array[x];
        console.log(artist);
        return artist;
    };


    $scope.myFunction = function() {
        //spins the wheel
        $scope.toSpin = true;
        //function to delay while wheel spins
        setTimeout(function(){
            //http call to database
        $http.get("/artist/grab").then(function(response){
            // artistArray is all of the artists in the database in an array
            var artistArray = response.data;
            //the following returns a random artist from artist array
            return randomArtist(artistArray);
        })
        //.then allows you to chain the previous function to the next one
            // so artist refers to randomArtist(artistArray)
        //the input of the next .then is the return value of the previous function
            .then (function (artist){
                $http({
                    method: 'GET',
                    url: 'http://ws.audioscrobbler.com/2.0/' + '?' + 'method=artist.getinfo&' +
                    'artist=' + artist.name + '&' +
                    'api_key=d3547c51a237e9e26fcdba8e4d4a97ce&' +
                    'format=json'
                })
                    .then(function (response) {
                        var entry = response.data;
                       artist.image = entry.artist.image[3]['#text'];
                        artistService.setCurrentArtist(artist);
                        $location.path('/artist');
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    })
            });
        }, 4010);
    };

}]);


app.controller('ArtistController', ['$scope', 'artistService', '$location', function($scope, artistService, location){
    $scope.artistToShow = artistService.getCurrentArtist();
}]);

app.controller('DatabaseController', ['$scope', '$http', 'artistService', '$location',
    function($scope, $http, artistService, $location){
    $scope.artistToShow = artistService.getCurrentArtist();
    $scope.data = {
        welcome: "Look! It's a picture of " + $scope.artistToShow.name +". Time for the next step. " +
    "You must click the button to find the Realm Of Dusk judgement, or return home. Make the call!"
    };


var check = false;

        chosenArtist = function (array) {
            console.log($scope.artistToShow.name, "Anthony");
            for (var i = 0; i < array.length; i++) {
                if($scope.artistToShow.name == array[i].name) {
                    var artist = array[i];
                    check = true;

                    console.log(artist, "New");
                }
            }
            return artist;
        };



    $scope.artistFunction = function(){
        $http.get('/artist/grab').then(function(response) {
            mongoArray = response.data;
            console.log(mongoArray, "All");
            return chosenArtist(mongoArray);
        }).then (function (artist){
            if(check === false){
                $location.path('/fail');
            } else {
                $http({
                    method: 'GET',
                    url: 'http://ws.audioscrobbler.com/2.0/' + '?' + 'method=artist.getinfo&' +
                    'artist=' + artist.name + '&' +
                    'api_key=d3547c51a237e9e26fcdba8e4d4a97ce&' +
                    'format=json'
                })
                    .then(function (response) {
                        var entry = response.data;
                        artist.image = entry.artist.image[3]['#text'];
                        artistService.setCurrentArtist(artist);
                        $location.path('/artist');
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $location.path('/fail');
                        $scope.artistToShow.name = $scope.noEntry;
                    })
            }
        });
    };
}]);

app.controller('FailController', ['$scope', 'artistService', '$location', function($scope, artistService, $location){
    $scope.noEntry = {
        message: "We're really sorry, but Realm Of Dusk doesn't have a page on this artist yet." +
        " Trust us, we have an opinion. Just be patient friend!",
        icon: "https://dougernst.files.wordpress.com/2010/06/axldoctrine.jpg"
    };

}]);

app.controller('EmptyController', ['$scope', 'artistService', '$location', function($scope, artistService, $location){
    $scope.noData = {
        message: "Either this artist does not exist, you spelled their name incorrectly, or you just put a bunch of" +
            " goobledygook in the search box. Try again friend!",
        icon: "http://gazettereview.com/wp-content/uploads/2016/02/Honey-boo-boo.jpg"
    };

}]);

// artistService is a factory that allows information to be shared between controllers
// service is set to empty object, currentArtist is also empty
// service.setCurrentArtist sets a method
app.factory('artistService', ['$http', function($http) {

    var service = {};

    var currentArtist = '';


    service.setCurrentArtist = function(artist) {
        currentArtist = artist;
    };

    service.getCurrentArtist = function() {
        return currentArtist;
    };

    return service;

}]);
