	// create the module and name it seafoodApp
	var seafoodApp = angular.module('seafoodApp', ['ngRoute']);

	// configure our routes
	seafoodApp.config(function ($routeProvider) {
	    $routeProvider

	        // route for the home page
	        .when('/', {
	            templateUrl: '/pages/login.html',
	            controller: 'mainController'
	        })

	        // route for the signup page
	        .when('/signup', {
	            templateUrl: '/pages/signup.html',
	            controller: 'signupController'
	        })

	        // route for the home page
	        .when('/home/:Parameter', {
	            templateUrl: '/pages/home.html',
	            controller: 'homeController'
	        })

	        // route for add enitiy
	        .when('/add', {
	            templateUrl: '/pages/add.html',
	            controller: 'addController'
	        })

	        // route for edit entity
	        .when('/edit/:EntityId', {
	            templateUrl: '/pages/edit.html',
	            controller: 'editController'
	        })

	        // route for confirm transaction
	        .when('/transact/:EntityId', {
	            templateUrl: '/pages/transact.html',
	            controller: 'transactController'
	        });


	});

	// create the controller and inject Angular's $scope
	seafoodApp.controller('mainController', ['$scope', 'MyService', '$window', '$location', function ($scope, MyService, $window, $location) {

	    $scope.LoginClicked = function () {
	        var username = $scope.username;
	        var password = $scope.password;

	        var url = "http://localhost:8080/api/auth/login/"; // put login url here
	        var getData = MyService.LoginUser(username, password, url);
	        getData.then(function (details) {
	                var results = details.data;
	                if (results.auth) {
	                    $scope.lt = results.token;
	                    MyService.logintoken = $scope.lt;
	                    $location.path("/home/username_" + MyService.authToken);
	                }
	            },
	            function () {
	                alert('Error in login. Please try again.');
	            });

	    }

	    $scope.toSignUpClicked = function () {
	        $location.path('/signup');
	    };


	}]);


	seafoodApp.service("MyService", function ($http) {

	    this.authtoken = "";
	    this.logintoken = "";

	    //// To Signup
	    this.SignUpUser = async function (name, username, password, email, type, newURL) {
	        var data = {
	            name: name,
	            username: username,
	            email: email,
	            password: password,
	            type: type
	        };

	        var config = {
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	            }
	        }

	        var res = await $http.post(newURL, data);
	        return res;

	    }

	    //// To Log in
	    this.LoginUser = async function (username, password, newURL) {
	        var data = {
	            username: username,
	            password: password
	        };

	        var config = {
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	            }
	        }

	        var res = await $http.post(newURL, data);
	        return res;

	    }


	    //// To Transact
	    this.Transact = async function (value, quantity, newURL) {
	        var data = {
	            value: value,
	            quantity: quantity
	        };

	        var config = {
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	            }
	        }

	        var res = await $http.post(newURL, data);
	        return res;

	    }

	    //// To Add
	    this.Add = async function (name, value, quantity, newURL) {
	        var data = {
	            name: name,
	            value: value,
	            quantity: quantity
	        };

	        var config = {
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	            }
	        }

	        var res = await $http.post(newURL, data);
	        return res;

	    }

	    //// To Edit
	    this.Edit = async function (name, value, quantity, index, stateId, newURL) {
	        var data = {
	            name: name,
	            value: value,
	            quantity: quantity,
	            index: index,
	            stateId: stateId
	        };

	        var config = {
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	            }
	        }

	        var res = await $http.post(newURL, data);
	        return res;

	    }



	});