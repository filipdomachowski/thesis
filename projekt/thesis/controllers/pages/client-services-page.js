appMainController.controller('client-services-page-controller', ['$scope', '$uibModal', '$rootScope', '$http',
	function($scope, $uibModal, $rootScope, $http){        
        		
		$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
		.then(function success(response){                    
			if(response.data.length > 0){					
				$scope.vehicleCards = response.data
				$scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
				return $http({method: 'GET', url: '/api/service-orders'})
			}else{
				$scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
			}
		}).then(function success(response){
			$scope.serviceOrders = response.data
			$scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
		})
		
		$scope.vehicleCards = null
		$scope.serviceOrders = null

		$scope.openVehicleCardModal = function(){			
			$uibModal.open(vehicleCardModal())
		}
		
		$scope.openVehicleRegisterModal = function(){
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(vehicleRegisterModal($scope.vehicleCards))			
			})			
		}

		$scope.openOrderingServiceModal = function(){	
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(orderingServicesModal($scope.vehicleCards, $scope.serviceOrders))			
			})		
		}		

		$scope.openServiceManagementModal = function(){
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(serviceManagementModal($scope.vehicleCards, $scope.serviceOrders))
			})
		}

    }
])