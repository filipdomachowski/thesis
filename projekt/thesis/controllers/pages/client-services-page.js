appMainController.controller('client-services-page-controller', ['$scope', '$uibModal', '$rootScope',
    function($scope, $uibModal, $rootScope){
        console.log("client page")

        $scope.openUserManagementModal = function(){			
			$uibModal.open(userManagementModal()).result.then(
				function success(result){
					console.log(result)
				}, function error(result){
					console.log(result)
				}
			)
        }
        
        $scope.openUserLoginModal = function(){			
			$uibModal.open(loginModal()).result.then(
				function success(result){
					$scope.$emit('login', result)
					$scope.$emit('notification', "Logowanie powiodło się", "alert-success")
				}, function error(result){
					console.log(result)
				}
			)
		}

		$scope.openVehicleCardModal = function(){			
			$uibModal.open(vehicleCardModal())
		}

		$scope.openVehicleRegisterModal = function(){
			$uibModal.open(VehicleRegisterModal)
		}

		$scope.logout = function(){			
			$scope.$emit('notification', `Wylogowano użytkownika ${$rootScope.currentUser.username}`, "alert-info")
			$scope.$emit('logout')			
		}

    }
])