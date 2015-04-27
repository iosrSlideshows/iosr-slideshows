'use strict';

var app = angular.module('slideshows', ['ui.router', 'ngResource']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    // default state
    $urlRouterProvider.when("", "/slideshows");
    $urlRouterProvider.when("/", "/slideshows");
    $urlRouterProvider.otherwise("/slideshows");

    // states
    $stateProvider
        .state('main', {
            url: "",
            views: {
                'navbar': {
                    templateUrl: 'templates/navigation.html',
                    controller: 'slideshowsController'
                }
            }
        })
        .state('main.slideshows', {
            url: "/slideshows?documentId",
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

app.service('httpInterceptor', function($q, $rootScope, httpStatusCode) {

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
            if(response.data.dbResult){
                return response.data.dbResult;
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

