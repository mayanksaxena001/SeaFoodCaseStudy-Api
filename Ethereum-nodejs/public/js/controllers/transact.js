seafoodApp.controller('transactController', ['$scope', 'MyService', '$routeParams','$window', '$location', function($scope, MyService, $routeParams, $window, $location) {

			$scope.EntityId = $routeParams.EntityId;
			
			//Get details from entity id and populate model
			
			$scope.viewModel = { "type":"Buyer" , "entity":"Goldfish" , "quantity":"08" , "value":"10" , "weight":"1 kg" , "place":"Pune" , "latitude":"1000", "longitude":"303", "date":"01/05/2018", "owner":"Saket Adhav" };
			
			$scope.type = $scope.viewModel.type;
            $scope.entity = $scope.viewModel.entity;
            $scope.quantity = $scope.viewModel.quantity;
            $scope.value = $scope.viewModel.value;
            $scope.weight = $scope.viewModel.weight;
			$scope.owner = $scope.viewModel.owner;
            $scope.place = $scope.viewModel.place;
            $scope.latitude = $scope.viewModel.latitude;
            $scope.longitude = $scope.viewModel.longitude;
			$scope.date = $scope.viewModel.date;
				
			$scope.donebtnClicked = function() {
				
				var value = $scope.value;
				var quantity = $scope.quantity;
				
				var url = "http://localhost:8080/api/auth/signup"; // put transact url here
            	var getData = MyService.Transact(value, quantity, url);
            	getData.then(function (details) {
                var results = details.data;
                if(results.auth){
				var editId = $scope.EntityId;
				$location.path("/home/transactId_"+editId);
                }
            },
            function () {
            alert('Error in transaction. Please try again.');
            });

			};
	
			$scope.cancelbtnClicked = function() {
				var editId = $scope.EntityId;
				$location.path("/home/transactId_"+editId);
			};
	
	}]);