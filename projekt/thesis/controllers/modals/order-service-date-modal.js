var orderServiceDateModal = function(calendarDate, totalHours){
	return {
		templateUrl: '/templates/modals/order-service-date-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', 'userSvc', function ($scope, $uibModalInstance, $http, userSvc) {
                            
            $scope.calendarDate = calendarDate

            $scope.hstep = 1
            $scope.mstep = 60
            $scope.startsAt = moment(calendarDate).add(moment().hours(), 'hours').format()
            $scope.endsAt = moment($scope.startsAt).add(totalHours, 'hours').format()

            $scope.changed = function(){
                $scope.endsAt = moment($scope.startsAt).add(totalHours, 'hours').format()
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

            $scope.yes = function(){
                var dates = [$scope.startsAt, $scope.endsAt]
                $uibModalInstance.close(dates)
            }

        }]
	}
}