var orderDetailsModal = function(order){
	return {
		templateUrl: '/templates/modals/order-details-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance) {
            
            $scope.order = order

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}