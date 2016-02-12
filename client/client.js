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
        .when('/success', {
            templateUrl: 'views/fail.html',
            controller: 'SuccessController'
        })
        .when('/fail', {
            templateUrl: 'views/register.html',
            controller: 'FailController'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', 'artistService', '$location', function($scope, $http, artistService, $location) {
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
            var artist = response.data;
            console.log(response.data);
            artist.image = artist.artist.image[3]['#text'];
            console.log(artist);
            artistService.setCurrentArtist(artist);
            $location.path('/artist');

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
        }, 4100);
    };

}]);


app.controller('ArtistController', ['$scope', 'artistService', function($scope, artistService){
    $scope.artistToShow = artistService.getCurrentArtist();
}]);

app.controller('SuccessController', ['$scope', function($scope){

}]);

app.controller('FailController', ['$scope', function($scope){

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

