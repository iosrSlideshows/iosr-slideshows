var app = angular.module('slideshows');

app.controller('editorController', ['$scope', '$stateParams', 'restApiService', 'slideCreator', function ($scope, $stateParams, restApiService, slideCreator) {

	var doc;

	if($stateParams.documentId) {
		console.debug("Document: " + $stateParams.documentId);

		restApiService.getSlideshow($stateParams.documentId).then(function(response){
            doc = response;
            slideCreator.create("#presentation-window", doc.slides[0]);
		});
	} else {
		console.debug("No document parameter - creating new presentation");

		// TODO: creating presentation
	}

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

}]);
