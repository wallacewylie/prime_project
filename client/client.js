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
            var entry = response.data;
            var artistImage = entry.artist.image[3]['#text'];
            $location.path('/artist');
            artistService.setCurrentArtist(artistImage);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };



    $scope.toSpin = false;

    $scope.changeClass = function () {
        if ($scope.toSpin === false) {
            return "image-stationary";
        } else {
            return "image-to-spin";
        }

    };



    randomArtist = function (array) {
        var x = Math.floor(Math.random() * (array.length - 1));
           var artist = array[x];
        console.log(artist);
        return artist;
    };

    $scope.myFunction = function() {
        $scope.toSpin = true;
        console.log("click");
        setTimeout(function(){
        $http.get("/artist/grab").then(function(response){
            console.log(response);
            var artistArray = response.data;
            return randomArtist(artistArray);
        })
            .then (function (artist){
                console.log(artist, "Hello");
                $http({
                    method: 'GET',
                    url: 'http://ws.audioscrobbler.com/2.0/' + '?' + 'method=artist.getinfo&' +
                    'artist=' + artist.name + '&' +
                    'api_key=d3547c51a237e9e26fcdba8e4d4a97ce&' +
                    'format=json'
                })
                    .then(function (response) {
                        var entry = response.data;
                        console.log(response.data, "Howdy");
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

app.factory('searchService', ['$http', function($http) {

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