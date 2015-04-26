var app = angular.module('slideshows');

app.controller('demoController', ['$scope', '$log', 'restApiService', function($scope, $log, restApiService) {
   
	$scope.slideshowsString;
	$scope.selectedSlideshowString;
	$scope.slideshows;

	function getSlideshows(){
		restApiService.getSlideshows().then(function(response){
			$scope.slideshowsString = JSON.stringify(response ,null,"    ");
			$scope.slideshows = response;
		});
	}

	$scope.createSlideshow = function(){
		restApiService.createSlideshow($scope.newSlideBody).then(function(response){
			getSlideshows();
		})
	};

	$scope.deleteSlideshow = function(){
		restApiService.deleteSlideshow($scope.slideId).then(function(response){
			getSlideshows();
		});
	};

	$scope.onSlideshowSelected = function(id){
		restApiService.getSlideshow(id).then(function(response){
			$scope.selectedSlideshow = JSON.stringify(response);
		});
	}

	getSlideshows();

}]);
