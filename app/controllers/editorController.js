var app = angular.module('slideshows');

app.controller('editorController', ['$scope', '$resource', function($scope, $resource) {
    var s = Snap("#presentation-window");
    var circle = s.circle(150, 150, 100);
    circle.attr({
        fill: "#bada55",
        stroke: "#000",
        strokeWidth: 25
    });
    circle.drag();
    s.text(600, 100, "Sample text");
}]);
