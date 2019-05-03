var appMainController = angular.module('app-root-controller', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angularjsToast', 'mwl.calendar'])

.directive('snInformationNote', snInformationNote)
.directive('snDictionarySelect', snDictionarySelect)
.directive('snDictionaryList', snDictionaryList)
.service('userSvc', ['$http', userSvc])
.config(['calendarConfig', function(calendarConfig){
    console.log(calendarConfig)
    moment.locale('pl')
    calendarConfig.dateFormatter = 'moment'
    calendarConfig.i18nStrings.weekNumber = 'Tyg. {week}'
    calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
    calendarConfig.colorTypes = {
        occupied: 'red',
        users: 'blue'
    }

}])

appMainController.controller('main-controller', ['$scope', '$rootScope', '$location','$uibModal', 'userSvc', 'toast',  function($scope, $rootScope, $location, $uibModal, userSvc, toast){    
    
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

    $scope.logout = function(){			
        $scope.$emit('notification', `Wylogowano użytkownika ${$rootScope.currentUser.username}`, "alert-info")
        $scope.$emit('logout')			
    }

}])