var app = angular.module('slideshows');

app.controller('loginController', ['$scope', '$resource', function ($scope, $resource) {
    var data = $resource('_slideshow.json');
    data.get({}, function (data) {
        $scope.content = data;
    });
    //var json = JSON.parse(jsonContent);
    //$scope.content = json;
}]);
