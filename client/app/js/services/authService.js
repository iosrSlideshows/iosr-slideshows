var app = angular.module('slideshows');

app.service('authService', [ '$rootScope', 'restApiService', '$q', function($rootScope, restApiService, $q) {

    this.initialize = function(){
        var deferred = $q.defer();
        restApiService.getUserProfile().then(function(response){
            $rootScope.user = angular.copy(response.data);
            deferred.resolve($rootScope.user);
        });
        return deferred.promise;
    }

    this.logout = function() {
        restApiService.logout().then(function(){
            $rootScope.user = null;
        })
	};

    this.getUser = function() {
		return $rootScope.user;
	};

    this.isAuthorized = function() {
        return $rootScope.user;
    }

}]);
