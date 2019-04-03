var userManagementModal = function(){
	return {
		templateUrl: '/templates/modals/user-management-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance, $http) {
                       
            $scope.user = {
                username: null,
                password: null
            }

            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/users', data: $scope.user })
				.then(function success(response){												
					console.log('UTWORZONO', response.data)
			    }, function error(response){
                    console.log('ERROR BULWO', response.data)
                })	
                
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}