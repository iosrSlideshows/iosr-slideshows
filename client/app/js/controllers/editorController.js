var app = angular.module('slideshows');

app.controller('editorController', ['$scope', '$resource', 'slideCreator', function ($scope, $resource, slideCreator) {

	// sample presentation JSON
	// in future will be downloaded from server
	var doc = {
		slides: [
			{
				"content": [
					{
						"type": "text-field",
						"text": "Slajd 1",
						"position": {
							"x": 100,
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
						"radius": 100
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
	};

	$scope.thumbnails = [
		{
			title: "jeden"
		},
		{
			title: "dwa"
		},
		{
			title: "trzy"
		}
	];

	slideCreator.create("#presentation-window", doc.slides[0]);
}]);
