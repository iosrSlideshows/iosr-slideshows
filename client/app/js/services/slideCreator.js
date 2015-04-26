var app = angular.module('slideshows');

/* service for creating slide on SVG element */
app.factory('slideCreator', function() {
	var creator = {};

	var x, y;

	var dragMoveFunc = function (dx, dy) {
		this.attr({
			x: +x+dx,
			y: +y+dy
		});
	};

	var dragStartFunc = function() {
		x = this.attr("x");
		y = this.attr("y");
	};

	var typeObjectCreators = {
		'text-field': function(svg, contentObject) {
			console.debug("Drawing 'text-field'");

			var text = svg.text(contentObject.position.x, contentObject.position.y, contentObject.text);
			text.drag();
		},
		'image': function(svg, contentObject) {
			console.debug("Drawing 'image'");

			var image = svg.image(contentObject.url, contentObject.position.x, contentObject.position.y, contentObject.size.width, contentObject.size.height);
			image.drag(dragMoveFunc, dragStartFunc, function() {
				contentObject.position.x = +this.attr("x");
				contentObject.position.y = +this.attr("y");
				console.debug("Moved to new position: (" + this.attr("x") + "," + this.attr("y") + ")");
			});

			// TODO: delete, another approach:
			//eve.on("snap.drag.end." + image.id, function () {
			//	console.log("aksjdhsakjdhaskjdahkdjshdakjsdhkd");
			//});
		},
		'circle': function(svg, contentObject) {
			console.debug("Drawing 'circle'");

			var circle = svg.circle(contentObject.position.x, contentObject.position.y, contentObject.radius);
			circle.attr({
				"fill" : contentObject.color
			});
			circle.drag();
		},
		'line': function(svg, contentObject) {
			console.debug("Drawing 'line'");

			var line = svg.line(contentObject.begin.x, contentObject.begin.y, contentObject.end.x, contentObject.end.y);
			line.attr({
				"stroke-width" : 5,
				"stroke": contentObject.color
			});
			line.drag();
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
