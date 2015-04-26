var app = angular.module('slideshows');

app.service('restApiService', [ '$http', 'dbMockService', 'config', 'modes', '$q', 'httpStatusCode', function($http, dbMockService, config, modes, $q, httpStatusCode){

	function onServerError(){
		alert("Server error occured");
	}

	function getSuccessResponse(data) {
		data : data
	}

	function getErrorResponse() {
		return {
			error : true,
			success : false
		};
	}

	var devFunctions = {

		getSlideshows : function() {
			var deferred = $q.defer();
			dbMockService.getSlideshows().then(function(response){
				if(response.status === httpStatusCode.SUCCESS) {
					deferred.resolve(getSuccessResponse(response.data));
				} else {
					onServerError();
					deferred.resolve(getErrorResponse());
				}
			});

			return deferred.promise;
		
		},

		createSlideshow : function(slideshow) {
			var deferred = $q.defer();
			dbMockService.createSlideshow(slideshow).then(function(response){
				if(response.status === httpStatusCode.SUCCESS) {
					deferred.resolve(getSuccessResponse(response.data));
				} else {
					onServerError();
					deferred.resolve(getErrorResponse());
				}
			});

			return deferred.promise;
		},

		deleteSlideshow : function(id) {
			var deferred = $q.defer();
			dbMockService.deleteSlideshow(id).then(function(response){
				if(response.status === httpStatusCode.SUCCESS) {
					deferred.resolve(getSuccessResponse(response.data));
				} else {
					onServerError();
					deferred.resolve(getErrorResponse());
				}
			});

			return deferred.promise;
		},

		getSlideshow : function(id) {
			var deferred = $q.defer();
			dbMockService.getSlideshowById(id).then(function(response){
				if(response.status === httpStatusCode.SUCCESS) {
					deferred.resolve(getSuccessResponse(response.data));
				} else {
					onServerError();
					deferred.resolve(getErrorResponse());
				}
			});

			return deferred.promise;
		}

	}

	var prodFunctions = {

		getSlideshows : function() {
			return $http.get('/slideshows');
		},

		createSlideshow : function(slideshow) {
			return $http.put('/slideshows', slideshow);
		},

		deleteSlideshow : function(id) {
			return $http.delete('/slideshows/' + id);
		},

		getSlideshow : function(id) {
			return $http.get('/slideshows/' + id);
		}
	}

	if(config.mode === modes.DEV) {
		return devFunctions;
	} else {
		return prodFunctions;
	}

}]);