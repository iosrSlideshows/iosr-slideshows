var app = angular.module('slideshows');

/* service for creating slide on SVG element */
app.factory('slideCreator', function() {
	var creator = {};

	var typeObjectCreators = {
		'text-field': function(svg, contentObject) {
			console.debug("Drawing 'text-field'");

			var text = svg.text(contentObject.position.x, contentObject.position.y, contentObject.text);
			text.drag();
		},
		'image': function(svg, contentObject) {
			console.debug("Drawing 'image'");

			var image = svg.image(contentObject.url, contentObject.position.x, contentObject.position.y, contentObject.size.width, contentObject.size.height);
			image.drag();
		},
		'circle': function(svg, contentObject) {
			console.debug("Drawing 'circle'");

			var circle = svg.circle(contentObject.position.x, contentObject.position.y, contentObject.radius);
			circle.drag();
		}
	};

	creator.create = function(svgObjectSelector, slide) {
		if(slide.content) {
			var svg = Snap(svgObjectSelector);
			slide.content.forEach(function (contentObject) {
				if(typeObjectCreators[contentObject.type]) {
					typeObjectCreators[contentObject.type](svg, contentObject);
				} else {
					console.error("'Content' element has unsupported 'type': '%s'\n%o", contentObject.type, contentObject);
				}
			});
		} else {
			console.error("Slide without 'content' section");
		}
	};

	return creator;
});
