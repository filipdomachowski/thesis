var openVehicleRegisterModal = function(){
	return {
		templateUrl: '/templates/modals/vehicle-register-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance, $http) {
            
            
  
            $scope.yes = function(){
                
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}