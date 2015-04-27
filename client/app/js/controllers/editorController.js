var app = angular.module('slideshows');

app.controller('editorController', ['$scope', '$stateParams', 'restApiService', 'slideCreator','authService', function ($scope, $stateParams, restApiService, slideCreator, authService) {

	var doc;

    $scope.user = authService.getUser();

    $scope.logout = function(){
        authService.logout();
    };

	if($stateParams.documentId) {
		console.debug("Document: " + $stateParams.documentId);

		restApiService.getSlideshow($stateParams.documentId).then(function(response){
            doc = response;
            $scope.slideshowInfo.name = doc.document_name;
            $scope.slideshowInfo.id = $stateParams.documentId;
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
