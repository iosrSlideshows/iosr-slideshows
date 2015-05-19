var app = angular.module('slideshows');

app.service('dbMockService', function(){

	var slideshows = [
		{
			"_id": "551a86e141fec5711b000001",
            "document_name": "Testowa prezentacja",
            slides: [
                {
                    "content": [
                        {
                            "type": "text-field",
                            "text": "Piękna prezentacja",
                            "position": {
                                "x": 400,
                                "y": 200
                            }
                        },
                        {
                            "type": "image",
                            "url": "http://static.polskieradio.pl/7abdaaa9-1928-403d-a1ec-a913249edffe.file",
                            "size": {
                                "width": 200,
                                "height": 100
                            },
                            "position": {
                                "x": 400,
                                "y": 200
                            }
                        },
                        {
                            "type": "circle",
                            "position": {
                                "x": 100,
                                "y": 200
                            },
                            "radius": 10,
                            "color": "#FCF"
                        },
                        {
                            "type": "line",
                            "begin": {
                                "x": 100,
                                "y": 100
                            },
                            "end": {
                                "x": 200,
                                "y": 200
                            },
                            "color": "#ACF"
                        }
                    ]
                },
                {
                    "content": [
                        {
                            "type": "text-field",
                            "text": "Slajd 2",
                            "position": {
                                "x": 100,
                                "y": 200
                            }
                        }
                    ]
                },
                {
                    "content": [
                        {
                            "type": "text-field",
                            "text": "Slajd 3",
                            "position": {
                                "x": 100,
                                "y": 200
                            }
                        }
                    ]
                },
                {
                    "content": [
                        {
                            "type": "text-field",
                            "text": "Slajd 4",
                            "position": {
                                "x": 100,
                                "y": 200
                            }
                        }
                    ]
                }
            ]
        }
	];

	var idSeed = 0;
	function getId(){
		idSeed++;
		return idSeed.toString();
	}

	this.getSlideshowById = function(id){
		var result = null;

		for(var i = 0, len = slideshows.length; i < len ; i++){
			if(slideshows[i]._id === id) {
				result = slideshows[i];
			}
		}

        return result;
	};

	this.getSlideshows = function() {
		var result = [];
		for(var i = 0, len = slideshows.length; i < len ; i++) {
			var tmp = slideshows[i];
			result.push({
				_id : tmp._id,
				document_name: tmp.document_name
			}); 
		}

        return result;
	};

	this.createSlideshow = function(slideshow) {
		var toInsert = angular.copy(slideshow);
		toInsert._id = getId();
		slideshows.push(toInsert);
        return toInsert._id;
	};

	this.deleteSlideshow = function(id) {
		var found = false;

		for(var i = 0, len = slideshows.length; i < len ; i++){
			if(slideshows[i]._id === id) {
				slideshows.splice(i, 1);
				found = true;
				break;
			}
		}

        return found;
	};

    this.updateSlideshow = function(slideshow) {
        var found = false;

        for(var i = 0, len = slideshows.length; i < len ; i++){
            if(slideshows[i]._id === slideshow._id) {
                slideshows[i] = slideshow;
                found = true;
                break;
            }
        }

        return found;
    };

});
