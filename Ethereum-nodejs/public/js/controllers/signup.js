seafoodApp.controller('signupController', ['$scope', 'MyService', '$window', '$location', function ($scope, MyService, $window, $location) {

	$scope.authToken = "";

	$scope.types = ["Fisherman", "Buyer", "Restaurant Owner"];

	$scope.selectedType = "Select type";

	$scope.signUpClicked = async function () {
		var name = $scope.name_signup;
		var username = $scope.username_signup;
		var password = $scope.password_signup;
		var email = $scope.email_signup;
		var type = $scope.selectedType;
		var url = "http://localhost:8080/api/auth/signup";

		var getData = MyService.SignUpUser(name, username, password, email, type, url);
		getData.then(function (details) {
				var results = details.data;
				if (results.auth) {
					$scope.authToken = results.token;
					MyService.authtoken = $scope.authToken;
					$location.path("/home/username_" + MyService.authToken);
				}
			},
			function () {
				alert('Error in sign up. Please try again.');
			});


	};

	$scope.toLoginClicked = function () {
		$location.path("/");
	};

}]);