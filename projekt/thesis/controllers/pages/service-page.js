appMainController.controller('service-page-controller', ['$scope', '$uibModal', '$http',
    function($scope, $uibModal, $http){                

        $scope.serviceOrders = null
        $scope.users = null
        $scope.vehicleCards = null

        $scope.openDictionaryEditingModal = function(){
            $http({ method: 'GET', url: '/api/dictionaries/Services' })
			.then(function success(response){                    
                $uibModal.open(dictionaryEditionModal(response.data))
            })
        }

        $scope.openOrdersPreviewModal = function(){
            $http({method: 'GET', url: '/api/service-orders'})
            .then(function success(response){ 
                $scope.serviceOrders = response.data
                return $http({method: 'GET', url: '/api/users/all'})                 
            })
            .then(function success(response){                
                $scope.users = response.data
                return $http({method: 'GET', url: '/api/vehicle-card'})                  
            })
            .then(function success(response){
                $scope.vehicleCards = response.data
                $uibModal.open(ordersPreviewModal($scope.serviceOrders, $scope.users, $scope.vehicleCards))	
            })
        }

    }
])