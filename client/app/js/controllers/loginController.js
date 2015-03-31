var app = angular.module('slideshows');

app.controller('loginController', ['$scope', 'sessionService', '$resource', function ($scope, sessionService, $resource) {
    var data = $resource('_slideshow.json');
    //data.get({}, function (data) {
    //    $scope.content = data;
    //});
	$scope.content = sessionService.loggedIn();
    //var json = JSON.parse(jsonContent);
    //$scope.content = json;
	$scope.login = function () {
		sessionService.begin();
		$scope.content = sessionService.loggedIn();
	}
}]);
