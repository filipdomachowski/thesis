var loginModal = function(){
	return {
		templateUrl: '/templates/modals/login-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', 'userSvc', function ($scope, $uibModalInstance, $http, userSvc) {
                      
            $scope.username = null
            $scope.password = null

            $scope.login = function(){
                userSvc.login($scope.username, $scope.password)
                    .then(function(user){
                        $uibModalInstance.close(user.data)
                    })                
            }

            $scope.$on('login', function(_, user){
                $scope.currentUser = user
            })    

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}