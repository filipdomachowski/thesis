var ordersPreviewModal = function(allServiceOrders, allUsers, allVehicleCards){
	return {
		templateUrl: '/templates/modals/orders-preview-modal.html',
        backdrop: 'static',         
        windowClass: 'max-size',
        controller:['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
            
            $scope.orders = allServiceOrders;
            $scope.users = allUsers;
            $scope.vehicleCards = allVehicleCards;
            $scope.calendarView = 'month';  
            $scope.cellIsOpen = true;                               
            $scope.viewDate = new Date();                          
            $scope.events = [];                        

            $scope.getUser = function(id){
                var user = $scope.users.find((user) => { return user._id === id});
                return user.username;
            }

            $scope.getVehicleCard = function(id){
                var card = $scope.vehicleCards.find((card) => { return card._id === id})
                return `${card.brand} ${card.model}${card.generation} - ${card.engine} / ${card.carLicensePlates}`
            }

            $scope.getServices = function(list){
                var list = list.map(function(service){
                    return {
                        service: service.key
                    }
                })
                return list
            }                        

            var actions = [{
                label: '<i class="fas fa-search"></i>',
                onClick: function(args) {
                    $scope.previewDayServices(args.calendarEvent);
                }
            }]

            $scope.previewDayServices = function(event){
                $uibModal.open(orderDetailsModal(event))
            }

            $scope.updateEvents = function(orders){
                $scope.events = orders.map(function(order){
                    return{
                        actions: actions,
                        title: order.title,
                        user: $scope.getUser(order.userId),
                        vehicle: $scope.getVehicleCard(order.vehicleCardId),
                        services: $scope.getServices(order.servicesList),
                        startsAt: new Date(order.dateFrom),
                        endsAt: new Date(order.dateTo),
                        duration: moment(order.dateFrom).format('HH:mm') + ' - ' + moment(order.dateTo).format('HH:mm'),                        
                    }
                })
                console.log($scope.events)
            }

            $scope.updateEvents($scope.orders)          

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}