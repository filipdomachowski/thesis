var vehicleCardModal = function(){
	return {
		templateUrl: '/templates/modals/vehicle-card-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', 'toast', function ($scope, $rootScope, $uibModalInstance, $http, toast) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;            

            $scope.vehicleCardsList = [{
                userId: $rootScope.currentUser._id,                
                brand:  null,
                model:  null,
                generation: null,
                body:   null,
                fuelType: null,
                engine: null,
                horsepower: null,
                transmissionType: null,
                milage: null,
                carLicensePlates: null,
                yearOfProduction: null,
                serviceHistory: []
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
                    brand:  null,
                    model:  null,
                    body:   null,
                    engine: null,
                    horsepower: null,
                    milage: null,
                    carLicensePlates: null,
                    yearOfProduction: null,
                    serviceHistory: []
                })
            }

            $scope.show = function(){
                console.log($scope.vehicleCardsList)
            }         
            
            $scope.removeVehicleCard = function(cardIndex){
            	$scope.vehicleCardsList.splice(cardIndex, 1)
            }  

            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/vehicle-card', data: $scope.vehicleCardsList }).then(
                    function success(response){
                        toast({
                            duration: 5000,
                            message: 'Dodano kartę pojazdu',
                            className: 'alert-success'
                        })
                        $scope.vehicleCardsList = [{
                            userId: $rootScope.currentUser._id,                
                            brand:  null,
                            model:  null,
                            body:   null,
                            engine: null,
                            horsepower: null,
                            milage: null,
                            carLicensePlates: null,
                            yearOfProduction: null,
                            serviceHistory: []
                        }];          
                    }, function error(response){
                        toast({
                            duration: 5000,
                            message: 'Wystąpił błąd podczas dodawania karty pojazdu',
                            className: 'alert-danger'
                        })
                    }
                )
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}