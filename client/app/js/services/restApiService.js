var app = angular.module('slideshows');

app.service('restApiService', [ '$http', 'dbMockService', '$q', '$rootScope', function($http, dbMockService, $q, $rootScope){

	var unauthFunctions = {

		getSlideshows : function() {
			var deferred = $q.defer();
            deferred.resolve(dbMockService.getSlideshows());
			return deferred.promise;
		},

		createSlideshow : function(slideshow) {
			var deferred = $q.defer();
            deferred.resolve(dbMockService.createSlideshow(slideshow));
			return deferred.promise;
		},

		deleteSlideshow : function(id) {
			var deferred = $q.defer();
            deferred.resolve(dbMockService.deleteSlideshow(id));
			return deferred.promise;
		},

		getSlideshow : function(id) {
			var deferred = $q.defer();
            deferred.resolve(dbMockService.getSlideshowById(id));
			return deferred.promise;
		}

	}

	var authFunctions = {

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

    return {
        getSlideshows : function() {
            return $rootScope.authenticated ? authFunctions.getSlideshows() : unauthFunctions.getSlideshows();
        },

        createSlideshow : function(slideshow) {
            return $rootScope.authenticated ? authFunctions.createSlideshow(slideshow) : unauthFunctions.createSlideshow(slideshow);
        },

        deleteSlideshow : function(id) {
            return $rootScope.authenticated ? authFunctions.deleteSlideshow(id) : unauthFunctions.deleteSlideshow(id);
        },

        getSlideshow : function(id) {
            return $rootScope.authenticated ? authFunctions.getSlideshow(id) : unauthFunctions.getSlideshow(id);
        },

        getUserProfile : function() {
            return $http.get('/profile');
        }
    }

}]);