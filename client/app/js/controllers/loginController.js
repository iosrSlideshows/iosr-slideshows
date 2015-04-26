var app = angular.module('slideshows');

app.controller('loginController', ['$scope', 'authService', '$stateParams', '$state', function ($scope, authService, $stateParams, $state) {

    $scope.isLoggedIn = authService.isAuthorized();
    if($scope.isLoggedIn) {
        $scope.user = authService.getUser();
    }

    if($stateParams.success != null) {
        if($stateParams.success){
            authService.initialize().then(function(user){
                $scope.isLoggedIn = true;
                $scope.user = user;
            });
        } else {
            alert("Login failure");
        }
    }

    $scope.back = function(){
        $state.go('home')
    };

}]);
