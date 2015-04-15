var app = angular.module('slideshows');

app.controller('demoController', ['$scope', '$log', 'restApiService', function($scope, $log, restApiService) {
   
	$scope.slideshowsString;
	$scope.selectedSlideshowString;
	$scope.slideshows;

	function getSlideshows(){
		restApiService.getSlideshows().then(function(response){
			if(response.success){
				$scope.slideshowsString = JSON.stringify(response.data ,null,"    ");
				$scope.slideshows = response.data;
			}
		});
	}

	$scope.createSlideshow = function(){
		restApiService.createSlideshow($scope.newSlideBody).then(function(response){
			if(response.success){
				getSlideshows();
			}
		})
	};

	$scope.deleteSlideshow = function(){
		restApiService.deleteSlideshow($scope.slideId).then(function(response){
			if(response.success){
				getSlideshows();
			}
		});
	};

	$scope.onSlideshowSelected = function(id){
		restApiService.getSlideshow(id).then(function(response){
			if(response.success){
				$scope.selectedSlideshow = JSON.stringify(response.data);
			}
		});
	}

	getSlideshows();

}]);
