'use strict';

var app = angular.module('slideshows', ['ui.router', 'ngResource']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
        .state('editor', {
            url: "/editor",
            templateUrl: "templates/editor.html"
        })
        .state('demo', {
            url: "/demo",
            templateUrl: "templates/demo.html",
            controller: "demoController"
        });
}]);

app.constant('modes', {
    DEV : 'DEV',
    PROD : 'PROD'
});

app.constant('config', {
    mode : 'DEV' //DEV - bez bazy / PROD
});

app.constant('httpStatusCode', {
    SUCCESS : 200,
    CREATED : 201,
    NO_CONTENT : 204,

    NOT_FOUND : 404 
});


