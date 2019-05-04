 var orderingServicesModal = function(usersCars, orders, orderToEdit){
	return {
		templateUrl: '/templates/modals/ordering-services-modal.html',
        backdrop: 'static',         
        windowClass: 'max-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', '$uibModal', 'calendarConfig', 'toast',
            function ($scope, $rootScope, $uibModalInstance, $http, $uibModal, calendarConfig, toast) { 
                            
            $scope.calendarView = 'month';  
            $scope.cellIsOpen = true;  
            $scope.allActivities = [];
            $scope.totalHours = 0;    
            $scope.totalMoney = 0;          
            $scope.viewDate = new Date();  
            $scope.orders = orders
            $scope.activeBookmark = 0;
            $scope.events = [];
            $scope.orderToEdit = orderToEdit;
            $scope.serviceType = null;
            $scope.mode = 'ADD'
            
            if($scope.orderToEdit === undefined || $scope.orderToEdit === null){
                $scope.serviceOrder = {
                    userId: $rootScope.currentUser._id,
                    title: null,
                    vehicleCardId: null,
                    dateFrom: null,
                    dateTo: null,
                    servicesList: [],    
                }                                
            }else{
                $scope.serviceOrder = $scope.orderToEdit
                $scope.serviceType = $scope.orderToEdit.servicesList[0].parentKey
                $scope.serviceOrder.inEditing = true
                $scope.mode = 'EDIT'
            }

            $scope.updateEvents = function(orders){
                $scope.events = orders.map(function(order){
                    return{
                        title: order.userId === $rootScope.currentUser._id ? order.title : 'Zarezerwowane',
                        startsAt: new Date(order.dateFrom),
                        endsAt: new Date(order.dateTo),
                        duration: moment(order.dateFrom).format('HH:mm') + ' - ' + moment(order.dateTo).format('HH:mm'),                        
                        type: order.userId === $rootScope.currentUser._id ? 'users' : 'occupied',
                        color:  order.userId === $rootScope.currentUser._id ? 'users' : 'occupied',
                        inEditing: order.inEditing
                    }
                })
                console.log($scope.events)
            }

            $scope.updateEvents($scope.orders)            
            
            $scope.changeBookmark = function(bookmark){
                $scope.activeBookmark = bookmark
            }

            $scope.next = function(){
                $scope.activeBookmark += 1
            }

            $scope.previous = function(){
                $scope.activeBookmark -= 1
            }

            $scope.userVehiclesCards = usersCars.map(function(vehicleCard){
                return {
                    vehicle: `${vehicleCard.brand} ${vehicleCard.carLicensePlates} / ${vehicleCard.model}(${vehicleCard.generation}) ${vehicleCard.engine}`,
                    vehicleCardId: vehicleCard._id
                }
            })     

            $scope.showVehicle = function(){
                if($scope.serviceOrder.vehicleCardId !== null){
                    var car = $scope.userVehiclesCards.find(function(card){
                        return card.vehicleCardId === $scope.serviceOrder.vehicleCardId
                    })
                    return car.vehicle
                }else{
                    return 'Nie wybrano pojazdu'
                }
            }

            $scope.returnOrderDate = function(){
                if($scope.serviceOrder.dateFrom !== null) return moment($scope.serviceOrder.dateFrom).format('YYYY-MM-DD HH:mm')
                else return 'Nie zarezerwowano terminu'
            }

            $scope.bookingDate = function(calendarNextView, calendarDate){                
                if($scope.serviceOrder.servicesList.length > 0){
                    if($scope.mode === 'EDIT'){
                        calendarDate = new Date($scope.serviceOrder.dateFrom)
                        $uibModal.open(orderServiceDateModal(calendarDate, $scope.totalHours, true)).result.then(
                            function success(result){
                                $scope.serviceOrder.dateFrom = result[0]
                                $scope.serviceOrder.dateTo = result[1]
                            }
                        )
                    }else{
                        $uibModal.open(orderServiceDateModal(calendarDate, $scope.totalHours)).result.then(
                            function success(result){
                                $scope.serviceOrder.dateFrom = result[0]
                                $scope.serviceOrder.dateTo = result[1]
                            }
                        )
                    }
                }else{
                    toast({
                        duration: 5000,
                        message: 'Nie wybrano usług do zarezerwowania terminu',
                        className: 'alert-danger'
                    })
                }
                if(calendarNextView === 'day') return false                                
            }                                                                                  

            $scope.summaryOrder = function(list){
                $scope.totalHours = 0;
                $scope.totalMoney = 0;
                $scope.allActivities = [];                
                $scope.allActivities = list.map(function(order){
                    return {
                        activity: order.key
                    }
                })
                list.forEach(function(order){
                    $scope.totalHours += Number(order.param2.match(/\d+/)[0])
                    $scope.totalMoney += Number(order.param.match(/\d+/)[0])
                })
            }            

            $scope.yes = function(){

                if($scope.mode === 'ADD'){
                    $http({ method: 'POST', url: '/api/service-orders', data: $scope.serviceOrder })
                    .then(function success(response){                    
                        return $http({method: 'GET', url: '/api/service-orders'})			
                    }).then(function success(response){
                        $scope.orders = response.data				
                        $scope.updateEvents($scope.orders)
                    })
                }else{
                    delete $scope.serviceOrder.inEditing                                        
                    $http({ method: 'PATCH', url: '/api/service-orders', data: $scope.serviceOrder })
                    .then(function success(response){                    
                        return $http({method: 'GET', url: '/api/service-orders'})			
                    }).then(function success(response){
                        $scope.orders = response.data				
                        $scope.updateEvents($scope.orders)
                    })
                }
            }            

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}