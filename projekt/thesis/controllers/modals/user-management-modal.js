var userManagementModal = function(){
	return {
		templateUrl: '/templates/modals/user-management-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', 'toast', function ($scope, $uibModalInstance, $http, toast) {
                       
            $scope.user = {
                username: null,
                password: null
            }

            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/users', data: $scope.user })
				.then(function success(response){												
					toast({
                        duration: 5000,
                        message: 'Utworzono użytkownika',
                        className: 'alert-success'
                    })
                    $uibModalInstance.close()
			    }, function error(response){
                    toast({
                        duration: 5000,
                        message: response.datar,
                        className: 'alert-danger'
                    })
                })	
                
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}