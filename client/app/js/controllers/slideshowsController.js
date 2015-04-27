var app = angular.module('slideshows');

app.controller('slideshowsController', ['$scope', 'authService', 'restApiService', function ($scope, authService, restApiService) {

    authService.initialize().then(function(){
        restApiService.getSlideshows().then(function(slideshows){
            $scope.slideshows = slideshows;
        });
    });

    $scope.slideshowInfo = {};

}]);