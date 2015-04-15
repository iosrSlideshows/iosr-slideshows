var app = angular.module('slideshows');

app.service('dbMockService', [ '$http', 'config', 'modes', '$q', 'httpStatusCode', function($http, config, modes, $q, httpStatusCode){

	var slideshows = [
		{ 
			"_id": "55167e46e377e9360d000001", 
			"__v": 0,
			"document_name": "przepiekna prezentacja",
		    "author": "Cool Guy",
		    "version": 1,
		    "creation_date": "2015-03-20 18:54",
		    "last_modification_date": "2015-03-20 18:55",
		    "main_theme" : "Theme1",
		    "slides": []
		}, 
		{ 
			"_id": "55167edde377e9360d000002", 
			"document_name": "keke", 
			"__v": 0 
		}, 
		{ 
			"_id": "551a86e141fec5711b000001", 
			"document_name": "lol", 
			"__v": 0 
		}
	];

	var idSeed = 0;
	function getId(){
		idSeed++;
		return idSeed.toString();
	}

	this.getSlideshowById = function(id){
		var deferred = $q.defer();

		var result = null;

		for(var i = 0, len = slideshows.length; i < len ; i++){
			if(slideshows[i]._id === id) {
				result = slideshows[i];
			}
		}

		deferred.resolve(responsify(result, result === null ? httpStatusCode.NOT_FOUND : httpStatusCode.SUCCESS ));

		return deferred.promise;
	};

	this.getSlideshows = function() {
		var deferred = $q.defer();
		
		var result = [];
		for(var i = 0, len = slideshows.length; i < len ; i++) {
			var tmp = slideshows[i];
			result.push({
				_id : tmp._id,
				document_name: tmp.document_name
			}); 
		}

		deferred.resolve(responsify(result, httpStatusCode.SUCCESS ));
		
		return deferred.promise;
	};

	this.createSlideshow = function(slideshow) {
		var deferred = $q.defer();

		var toInsert = JSON.parse(angular.copy(slideshow));
		toInsert._id = getId();
		slideshows.push(toInsert);

		deferred.resolve(responsify(toInsert, httpStatusCode.SUCCESS));

		return deferred.promise;
	};

	this.deleteSlideshow = function(id) {
		var deferred = $q.defer();

		var found = false;

		for(var i = 0, len = slideshows.length; i < len ; i++){
			if(slideshows[i]._id === id) {
				slideshows.splice(i, 1);
				found = true;
				break;
			}
		}

		deferred.resolve(responsify(null, found ? httpStatusCode.SUCCESS : httpStatusCode.NOT_FOUND ));

		return deferred.promise;
	};

	function responsify(data, httpStatusCode){
		return {
			data : data,
			status : httpStatusCode
		};
	}

}]);
