var app = angular.module('slideshows');

app.service('authService', [ '$rootScope', 'restApiService', '$q', function($rootScope, restApiService, $q) {

    this.initialize = function(){
        var deferred = $q.defer();
        if(!$rootScope.user) {
            restApiService.getUserProfile().then(function (response) {
                if(response.status === 200) {
                    $rootScope.user = angular.copy(response.data);
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.user = null;
                    $rootScope.authenticated = false;
                }
                deferred.resolve($rootScope.user);
            });
        } else {
            $rootScope.authenticated = true;
            deferred.resolve($rootScope.user);
        }
        return deferred.promise;
    }

    this.getUser = function() {
		return $rootScope.user;
	};

}]);
