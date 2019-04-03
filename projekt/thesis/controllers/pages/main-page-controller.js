appMainController.controller('main-page-controller', ['$scope', '$uibModal', '$http',
    function($scope, $uibModal, $http){
        console.log("main page")    
        $scope.notes = [];

        $http({ method: 'GET', url: '/api/text-notes' })
        .then(function success(response){
            $scope.notes = response.data
        })

    }
])