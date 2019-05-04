appMainController.controller('main-page-controller', ['$scope', '$rootScope', '$uibModal', '$http',
    function($scope, $rootScope, $uibModal, $http){        

        $scope.notes = [];        

        $http({ method: 'GET', url: '/api/text-notes' })
        .then(function success(response){
            console.log("POBRANE NOTKI: ", response.data)
            $scope.notes = response.data
        })

        $scope.addNote = function(){
            $scope.notes.unshift({
                header: 'Nagłówek',
                text: 'Treść',
                headerStyle: {"font-size" : "18px", "text-align" : "center", "height" : "50px"},
                textStyle: {"font-size" : "14px", "text-align" : "left", "height" : "100px"},
                date: moment()
            })

            $scope.notes

        }

    }
])