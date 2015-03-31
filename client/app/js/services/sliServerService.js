var app = angular.module('slideshows');

app.service('sliServerService', function($http){

	//do dorobienia obsluga errorw w callbackach - tych z lacznoscia np nie zwroconych przez serwer w responsie
	this.getSlideshows = function(){
		return $http.get('/slideshows');
	};

	this.createSlideshow = function(slideshow){
		return $http.post('/slideshows', slideshow);
	};

	this.deleteSlideshow = function(id){
		return $http.delete('/slideshows/' + id);
	};

});