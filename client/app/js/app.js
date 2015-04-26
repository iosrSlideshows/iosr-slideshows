'use strict';

var app = angular.module('slideshows', ['ui.router', 'ngResource']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    // default state
    $urlRouterProvider.otherwise("/");

    // states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "templates/home.html"
        })
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "loginController"
        })
        .state('slideshows', {
            url: "/slideshows",
            templateUrl: "templates/slideshows.html",
            controller: "slideshowsController"
        })
        .state('slideshow', {
            url: "/slideshow/{documentId}",
            templateUrl: "templates/editor.html"
        })
        // TODO: this probably will be removed
        .state('editor', {
            url: "/editor",
            templateUrl: "templates/editor.html"
        })
        .state('demo', {
            url: "/demo",
            templateUrl: "templates/demo.html",
            controller: "demoController"
        });

    $httpProvider.interceptors.push('httpInterceptor');
}]);

app.constant('modes', {
    DEV : 'DEV',
    PROD : 'PROD'
});

app.constant('config', {
    mode : 'PROD' //DEV - bez bazy / PROD
});

app.constant('httpStatusCode', {
    SUCCESS : 200,
    CREATED : 201,
    NO_CONTENT : 204,

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
                $rootScope.$emit('dbError', response.data.error)
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
            $rootScope.$emit('serverError', rejection.data);
            console.error('serverError: ' + rejection.data);
            return $q.reject(rejection.data);
        }
    };
  
});

