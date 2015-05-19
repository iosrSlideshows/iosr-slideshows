var app = angular.module('slideshows');

/* service for creating slide on SVG element */
app.factory('slideCreator', function() {
	var creator = {};

	function dragMoveFunc(dx, dy) {
		if(this.resizeMode && this.resizeMode === true) {
			//var ratio = Math.sqrt(dx*dx+dy*dy)/10.0;
			//this.attr({
			//	width: +this.attr("width") +1,
			//	height: +this.attr("height") +1
			//});
			var scale = 1 + dx / 50;
			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "S" : "s") + scale
			});
		} else {
			this.attr({
				x: this.x + dx,
				y: this.y + dy
			});
		}
	}

	function dragStartFunc() {
		// data for resizing
		this.data('origTransform', this.transform().local);

		// data for moving
		this.x = +this.attr("x");
		this.y = +this.attr("y");
	}

	function resizingHandlerFunc() {
		if(this.resizeMode) {
			if(this.resizeMode === true) {
				this.resizeMode = false;
				console.debug('Resizing mode disabled');
			} else {
				this.resizeMode = true;
				console.debug('Resizing mode enabled');
			}
		} else {
			this.resizeMode = true;
			console.debug('Resizing mode enabled');
		}
	}

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
				if (this.resizeMode && this.resizeMode === true) {
					//this.attr("width") = +this.attr("width") + dx;
					this.resizeMode = false;
				} else {
					contentObject.position.x = +this.attr("x");
					contentObject.position.y = +this.attr("y");
					console.debug("Moved 'image' to new position: (" + this.attr("x") + "," + this.attr("y") + ")");
				}
			});

			image.dblclick(resizingHandlerFunc)

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
