var app = angular.module('slideshows');

app.controller('demoController', ['$scope', '$log', 'sliServerService', function($scope, $log, sliServerService) {
   
	$scope.slideshows;

	function getSlideshows(){
		sliServerService.getSlideshows().then(function(response){
			if(!response.data.error){
				$scope.slideshows = JSON.stringify(response.data ,null,"    ");
			} else {
				$log.error(response.data.error);
			}
		});
	}

	$scope.createSlideshow = function(){
		sliServerService.createSlideshow($scope.newSlideBody).then(function(response){
			if(!response.data.error){
				getSlideshows();
			} else {
				$log.error(response.data.error);
			}
		})
	};

	$scope.deleteSlideshow = function(){
		sliServerService.deleteSlideshow($scope.slideId).then(function(response){
			if(!response.data.error){
				getSlideshows();
			} else {
				$log.error(response.data.error);
			}
		});
	};

	getSlideshows();

}]);
