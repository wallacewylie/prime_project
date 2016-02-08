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

app.controller('MainController', ['$scope', '$http', function($scope, $http){
    $scope.intro = {
        question:'What is Realm of Dusk?',
        paragraph: "Realm of Dusk is a website that helps you approach music with the help of a trusty guide. " +
        "It can be dangerous out there, and if you're not careful you could find yourself lost in a twilight " +
        "world of mediocrity and confusion. Look ahead friend! My torch is lit. Let the adventure begin."
    };
    $scope.spin = {
        icon:"https://www.casinobum.com/files/includes/images/images-wheel1.png"
    };



    $scope.getInfo = function() {
        $http({
            method: 'GET',
            url: 'http://ws.audioscrobbler.com/2.0/' + '?' + 'method=artist.getinfo&' +
            'artist=' + $scope.searchBox + '&' +
            'api_key=d3547c51a237e9e26fcdba8e4d4a97ce&' +
            'format=json'
        }).then(function successCallback(response) {
            console.log(response.data.artist.name);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.toSpin = false;

    $scope.changeClass = function() {
            if ($scope.toSpin === false) {
                return "image-stationary";
            } else {
                return "image-to-spin";
            }
    };

    $scope.myFunction = function() {
        $scope.toSpin = true;
    };


}]);





app.controller('SuccessController', ['$scope', function($scope){


}]);

app.controller('ArtistController', ['$scope', function($scope){

}]);

app.controller('SuccessController', ['$scope', function($scope){


}]);

app.controller('FailController', ['$scope', function($scope){

}]);

