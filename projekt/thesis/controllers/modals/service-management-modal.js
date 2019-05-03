var serviceManagementModal = function(vehicleCards, orders){
	return {
		templateUrl: '/templates/modals/service-management-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$uibModal', '$http', 'toast', function ($scope, $rootScope, $uibModalInstance, $uibModal, $http, toast) {
                       
            console.log(vehicleCards)
            console.log(orders)

            $scope.vehicleCards = vehicleCards
            $scope.orders = orders

            $scope.userOrders = orders.filter(function(order){
                return order.userId === $rootScope.currentUser._id
            })

            $scope.no = function(){
                $uibModalInstance.close()
            }

            $scope.orderStatus = function(order){
                if(moment(order.dateFrom) <= moment() && moment(order.dateTo) >= moment() ) return "W trakcie"
                else if(moment(order.dateTo) <= moment()) return "Ukończono"
                else if(moment(order.dateFrom) > moment() ) return "Oczekiwanie"
            }           	

            $scope.deleteOrder = function(order, index){
                $scope.userOrders.splice(index, 1)
                $http({ method: 'DELETE', url: '/api/service-orders/' + order._id })
                    .then(function success(response){
                        toast({
                            duration: 5000,
                            message: 'Usunięto zamówienie',
                            className: 'alert-success'
                        })
                    })
            }

            $scope.editOrder = function(selectedOrder){
                $uibModal.open(orderingServicesModal($scope.vehicleCards, $scope.orders, selectedOrder))    
            }

        }]
	}
}