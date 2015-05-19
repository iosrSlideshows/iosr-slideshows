'use strict';

var app = angular.module('slideshows', ['ui.router', 'ngResource', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    // default state
    $urlRouterProvider.otherwise("/home");

    // states
    $stateProvider
        .state('app', {
            abstract : true,
            url: "",
            templateUrl: 'templates/main.html',
            resolve : {
                user: function(authService){
                    authService.initialize();
                }
            }
        })
        .state('app.home', {
            url: "/home",
            templateUrl: 'templates/home.html'
        })
        .state('app.slideshows', {
            url: "/slideshows",
            templateUrl: 'templates/slideshows.html',
            controller: 'slideshowsController'
        })
        .state('app.slideshow', {
            url: "/slideshows/{source}/{documentId}",
            templateUrl: 'templates/editor.html',
            controller: 'editorController'
        })

    $httpProvider.interceptors.push('httpInterceptor');
}]);

app.constant('httpStatusCode', {
    SUCCESS : 200,
    CREATED : 201,
    NO_CONTENT : 204,
    UNAUTHORIZED : 401,
    NOT_FOUND : 404 
});

app.constant('dataSource', {
    DRIVE : 'drive',
    DB : 'database',
    LOCAL : 'local'
});

app.service('httpInterceptor', function($q) {

    return {
       'request': function(config) {
            return config;
        },

        'requestError': function(rejection) {
            return $q.reject(rejection);
        },

        'response': function(response) {
            if(response.data.error){
                console.error('dbError: ' + response.data.error);
                return $q.reject(response.data.error);
            }
            if(response.data.result){
                console.log(response.data.result);
                return response.data.result;
            }
            return response;
        },

        'responseError': function(rejection) {
            //do obsluzenia rozne rejection.code ???
            console.error('serverError: ' + rejection.data);
            return $q.reject(rejection.data);
        }
    };
  
});

