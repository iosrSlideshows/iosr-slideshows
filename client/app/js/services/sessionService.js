var app = angular.module('slideshows');

app.factory('sessionService', function() {
	var session = {};
	session.state = 0;
	session.start = function() {
		session.state = 1;
	};
	session.end = function() {
		session.state = 0;
	};
	session.loggedIn = function() {
		return session.state === 1;
	};
	return session;
});
