var app = angular.module('slideshows');

app.controller('slideshowsController', ['$scope', 'dataSource', 'restApiService', function ($scope, dataSource, restApiService) {

    $scope.dataSource = dataSource;

    function refreshSlideshows(){
         restApiService.getSlideshows().then(function(response) {
             $scope.slideshows = response;
         });
    }

    $scope.delete = function(id, source) {
        restApiService.deleteSlideshow(id, source).then(refreshSlideshows);
    };

    refreshSlideshows();

}]);