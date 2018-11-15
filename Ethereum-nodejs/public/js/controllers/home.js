seafoodApp.controller('homeController', ['$scope', 'MyService', '$routeParams', '$window', '$location', function ($scope, MyService, $routeParams, $window, $location) {
	//split and relate parameter here
	$scope.Parameter = $routeParams.Parameter;

	$scope.types = ["Fisherman", "Buyer", "Restaurant Owner"];

	$scope.selectedType = "Select type";

	$scope.transferEntities = [];

	$scope.transactions = [];

	$scope.showAdminDetails = function () {
		$scope.at = MyService.authToken;
		$window.alert("authtoken =" + $scope.at);
	};

	$scope.TransactBtnClicked = function (id) {
		$location.path('/transact/' + id);
	};

	$scope.addEntityClicked = function () {
		$location.path('/add');
	};

	$scope.EditBtnClicked = function (id) {
		$location.path('/edit/' + id);
	};

	$scope.entityidClicked = function (id) {
		var entityId = id;
		$window.alert(id);
	};

	$scope.statusidClicked = function (id) {
		var statusId = id;
		$window.alert(id);
	};

	$scope.histblockhashClicked = function (bHash) {
		var blockHash = bHash;
		$window.alert(bHash);
	};

	$scope.histtransactionhashClicked = function (tHash) {
		var transactionHash = tHash;
		$window.alert(tHash);
	};

	$scope.blockhashClicked = function (bHash) {
		var blockHash = bHash;
		$window.alert(bHash);
	};

	$scope.transactionhashClicked = function (tHash) {
		var transactionHash = tHash;
		$window.alert(tHash);
	};

	//$scope.showModal = false;
	//$scope.buttonClicked = "";
	//$scope.toggleModal = function(btnClicked){
	//$scope.buttonClicked = btnClicked;
	//$scope.showModal = !$scope.showModal;
	//};

}]);