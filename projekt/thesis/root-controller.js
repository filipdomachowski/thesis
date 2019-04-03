var appMainController = angular.module('app-root-controller', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angularjsToast'])

.directive('snInformationNote', snInformationNote)
.directive('snDictionarySelect', snDictionarySelect)
.service('userSvc', ['$http', userSvc])

appMainController.controller('main-controller', ['$scope', '$rootScope', '$location', 'userSvc', 'toast', function($scope, $rootScope, $location, userSvc, toast){    
    
    userSvc.userState()
        .then(function success(response){
            $rootScope.currentUser = response.data
        }, function error(response){
            $scope.$emit('notification', "zaloguj się aby uzyskać dostęp do wszystkich funkcji serwisu", "alert-info",)            
        }
    )

    $scope.$on('login', function(event, user){
        $rootScope.currentUser = user                   
    })    

    $scope.$on('logout', function(){
        $rootScope.currentUser = null
        sessionStorage.clear()
        userSvc.logout()
        $location.path("/mainPage")
    })

    $scope.$on('notification', function(event, message, type){
        toast({
            duration: 5000,
            message: message,
            className: type
        })
    })

}])