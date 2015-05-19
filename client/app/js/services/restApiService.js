var app = angular.module('slideshows');

app.service('restApiService', [ '$http', 'dbMockService', '$q', '$rootScope', 'dataSource', function($http, dbMockService, $q, $rootScope, dataSource){

	var unauthFunctions = {

		getSlideshows : function() {
			var deferred = $q.defer();
            deferred.resolve({local : dbMockService.getSlideshows()});
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
		},

        updateSlideshow : function(slideshow) {
            var deferred = $q.defer();
            deferred.resolve(dbMockService.updateSlideshow(slideshow));
            return deferred.promise;
        }

	}

    function prepareSlideModel(slide){
        delete slide._id;
        delete slide.__v;

        if(slide.content && slide.content.length !== 0) {
            for (var i = 0, len = slide.content.length; i<len; i++){
                var content = slide.content[i];
                delete content.__v;
                delete content._id;
            }
        }
    }

    function getModelToSave(slideshow){
        var resultModel = angular.copy(slideshow);
        delete resultModel._id;
        delete resultModel.author;
        delete resultModel.__v;
        delete resultModel.creation_date;
        delete resultModel.last_modification_date;
        if(resultModel.slides && resultModel.slides.length !== 0) {
            for (var i = 0, len = resultModel.slides.length; i<len; i++){
                prepareSlideModel(resultModel.slides[i]);
            }
        }
        return resultModel;
    };

	var authFunctions = {

		getSlideshows : function() {
            var deferred = $q.defer();
            $http.get('/slideshows').then(function(result){
                    result[dataSource.LOCAL] = dbMockService.getSlideshows();
                    deferred.resolve(result);
                },
                function(){
                    deferred.resolve({local : dbMockService.getSlideshows()});
                });
            return deferred.promise;

        },

		createSlideshow : function(slideshow, source) {
            var modelToSave = getModelToSave(slideshow, true);
            if(source === dataSource.LOCAL) {
                return unauthFunctions.createSlideshow(modelToSave);
            }
            if(source === dataSource.DB) {
                return $http.put('/slideshows', modelToSave);
            }
            if(source === dataSource.DRIVE) {
                return $http.put('/slideshows/drive', modelToSave);
            }
        },

		deleteSlideshow : function(id, source) {
            if(source === dataSource.LOCAL) {
                return unauthFunctions.deleteSlideshow(id);
            }
            if(source === dataSource.DB) {
                return $http.delete('/slideshows/' + id);
            }
            if(source === dataSource.DRIVE) {
                return $http.delete('/slideshows/drive/' + id);
            }

		},

		getSlideshow : function(id, source) {
            if(source === dataSource.LOCAL) {
                return unauthFunctions.getSlideshow(id);
            }
            if(source === dataSource.DB) {
                return $http.get('/slideshows/' + id);
            }
            if(source === dataSource.DRIVE) {
                return $http.get('slideshows/drive/' + id);
            }
		},

        updateSlideshow : function(slideshow, source) {
            if(source === dataSource.LOCAL) {
                return unauthFunctions.updateSlideshow(slideshow);
            }

            if(source === dataSource.DB) {
                return $http.post('/slideshows', slideshow);
            }

            if(source === dataSource.DRIVE) {
                return $http.post('/slideshows/drive', slideshow);
            }
        }

	}

    return {
        getSlideshows : function() {
            return $rootScope.authenticated ? authFunctions.getSlideshows() : unauthFunctions.getSlideshows();
        },

        createSlideshow : function(slideshow, source) {
            return $rootScope.authenticated ? authFunctions.createSlideshow(slideshow, source) : unauthFunctions.createSlideshow(slideshow);
        },

        deleteSlideshow : function(id, source) {
            return $rootScope.authenticated ? authFunctions.deleteSlideshow(id, source) : unauthFunctions.deleteSlideshow(id);
        },

        getSlideshow : function(id, source) {
            return $rootScope.authenticated ? authFunctions.getSlideshow(id, source) : unauthFunctions.getSlideshow(id);
        },

        updateSlideshow : function(slideshow, source) {
            return $rootScope.authenticated ? authFunctions.updateSlideshow(slideshow, source) : unauthFunctions.updateSlideshow(slideshow);
        },

        getUserProfile : function() {
            var defer = $q.defer();
            $http.get('/profile').then(function(response){
                defer.resolve(response);
            },
            function(err){
                defer.resolve({});
            });
            return defer.promise;
        }
    }

}]);