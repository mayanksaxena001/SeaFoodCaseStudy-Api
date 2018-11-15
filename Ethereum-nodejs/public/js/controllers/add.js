seafoodApp.controller('addController', ['$scope', 'MyService', '$window', '$location', function ($scope, MyService, $window, $location) {

	$scope.addClicked = function () {
		var name = $scope.name;
		var value = $scope.value;
		var quantity = $scope.quantity;

		var url = "http://localhost:8080/contract/entity"; // add url here 

		var getData = MyService.Add(name, value, quantity, url);
		getData.then(function (details) {
				var results = details.data;
				if (results) {
					var addedId = 1;
					$location.path("/home/addId_" + addedId);
				}
			},
			function () {
				alert('Error in Add. Please try again.');
			});

	};

	$scope.cancelClicked = function () {
		$location.path("/home/addId_0");
	};

}]);