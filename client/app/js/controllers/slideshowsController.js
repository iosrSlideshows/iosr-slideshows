var app = angular.module('slideshows');

app.controller('slideshowsController', ['$scope', 'restApiService', function ($scope, restApiService) {

    restApiService.getSlideshows().then(function(response){
        $scope.slideshows = response;
    });

}]);