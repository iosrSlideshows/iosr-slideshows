var app = angular.module('slideshows');

app.controller('slideshowsController', ['$scope', 'restApiService', function ($scope, restApiService) {

    restApiService.getSlideshows().then(function(response){
        if(response.success){
            $scope.slideshows = response.data;

            console.debug("Received slideshows list", $scope.slideshows);
        } else {
            console.error("Slideshows GET error");
        }
    });

}]);