seafoodApp.controller('editController', ['$scope', 'MyService', '$routeParams', '$window', '$location', function ($scope, MyService, $routeParams, $window, $location) {

	$scope.EntityId = $routeParams.EntityId;

	$scope.editbtnClicked = function () {
		var name = $scope.name
		var value = $scope.value;
		var quantity = $scope.quantity;
		var index = $scope.index;
		var stateId = $scope._stateId;

		var url = "http://localhost:8080/contract/entity/update"; // edit url here 

		var getData = MyService.Edit(name, value, quantity, index, stateId, url);
		getData.then(function (details) {
				var results = details.data;
				if (results) {
					var editId = $scope.EntityId;
					$location.path("/home/editId_" + editId);
				}
			},
			function () {
				alert('Error in Add. Please try again.');
			});

	};

	$scope.cancelbtnClicked = function () {
		var editId = $scope.EntityId;
		$location.path("/home/editId_" + editId);
	};

}]);