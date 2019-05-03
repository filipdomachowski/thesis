var vehicleRegisterModal = function(cardList){
	return {
		templateUrl: '/templates/modals/vehicle-register-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', function ($scope, $rootScope, $uibModalInstance, $http) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;
            $scope.vehicleCardsList = cardList;            


  
            $scope.yes = function(){
                
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}