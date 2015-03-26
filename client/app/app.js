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
			templateUrl: "templates/login.html"
		})
        .state('editor', {
            url: "/editor",
            templateUrl: "templates/editor.html"
        });
}]);
