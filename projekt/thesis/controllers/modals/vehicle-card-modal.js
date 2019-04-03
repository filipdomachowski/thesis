var vehicleCardModal = function(){
	return {
		templateUrl: '/templates/modals/vehicle-card-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', function ($scope, $rootScope, $uibModalInstance, $http) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;            

            $scope.vehicleCardsList = [{
                userId: $rootScope.currentUser._id,
                brand: null,
                model: null,
                engine: null,
                milage: null
            }];          
            
            $scope.callback = function(item, key, toDelete, index){
                var card = $scope.vehicleCardsList[index]
                console.log(item, key, toDelete, index) 
                if(card[key] !== item && card[key] !== null){                    
                    for (let value of toDelete){
                        card[value] = null
                    }                   
                }
            }

            $scope.addVehicleCard = function(){
                $scope.vehicleCardsList.push({
                    userId: $rootScope.currentUser._id,
                    brand: null,
                    model: null,
                    engine: null,
                    milage: null
                })
            }

            $scope.show = function(){
                console.log($scope.vehicleCardsList)
            }
  
            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/vehicle-card', data: $scope.vehicleCardsList }).then(
                    function success(response){
                        $scope.$emit('notification', "Dodano kartę pojazdu", "alert-success")
                    }, function error(response){
                        $scope.$emit('notification', `Błąd podczas dodawania karty pojazdu: ${response.data}`, "alert-danger")
                    }
                )
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}