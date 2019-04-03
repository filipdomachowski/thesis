const snDictionarySelect = function(){
    return {
        restrict: 'AE',
		templateUrl: '/templates/directives/dictionary-select.html',		
		scope: {		
            snValue:    '=',
            snParam: '=',
            snDictKey:  '=',
            snParentKey:'=?',
            snChange: '&'                 
		},
		controller:['$scope', '$http',
			function($scope, $http) {                                                

                // $scope.itemsList = []                
                $scope.dictItem = $scope.snValue
                $scope.listExpanded = false

                $scope.snValue
				$scope.snDictKey
				$scope.snParentKey

                $scope.expandList = function(){
                    if($scope.itemsList.length > 0){
                        $scope.listExpanded = !$scope.listExpanded
                    }
                }

                $scope.getDictionary = function(urlParam, urlParentParam){
                    if(urlParentParam !== null && urlParentParam !== undefined){
                        $http({method: 'GET', url: '/api/dictionaries/' + urlParam + '/' + urlParentParam}).then(
                            function success(response){
                                if(response.data[0] !== null && response.data.length !== 0){
                                    $scope.itemsList = response.data[0].entries
                                }   
                                else $scope.itemsList = []                            
                            }, function error(response){
                                //TOSTER Z INFORMACJĄ O BŁEDZIE POBRANIA DANYCH ZE SŁOWNIKA
                            }
                        )                        
                    }else{                    
                        $http({method: 'GET', url: '/api/dictionaries/' + urlParam}).then(
                            function success(response){
                                if(response.data !== null) $scope.itemsList = response.data.entries 
                                else $scope.itemsList = []                            
                            }, function error(response){
                                //TOSTER Z INFORMACJĄ O BŁEDZIE POBRANIA DANYCH ZE SŁOWNIKA
                            }
                        )                        
                    }
                }

                $scope.selectItem = function(item){
                    $scope.dictItem = item.key
                    $scope.snValue = item.key
                    $scope.listExpanded = false                    
                }
                
                $scope.$watch('snValue', function(newVal, oldVal){
                    $scope.dictItem = newVal
                })

                if($scope.snDictKey !== null && $scope.snDictKey !== undefined && $scope.snParentKey !== null){
                    $scope.getDictionary($scope.snDictKey)
                }else if($scope.snParentKey !== undefined){
                    $scope.$watch('snParentKey', (newKey, oldKey) => {
                        if(newKey !== undefined && newKey !== null){                           
                            $scope.getDictionary($scope.snDictKey, newKey)                        
                        } 
                    })                    
                }else{
                    $scope.$watch('snDictKey', (newKey, oldKey) => {
                        if(newKey !== undefined && newKey !== null) { 
                            $scope.snChange                           
                            $scope.getDictionary(newKey)                        
                        }
                    })                    
                }                                
			}
		]
    }
}
const snInformationNote = function(){
    return {
        restrict: 'AE',
		templateUrl: '/templates/directives/information-note.html',		
		scope: {		
			snNoteText: '='
		},
		controller:['$scope', '$http',
			function($scope, $http) {
				$scope.text = $scope.snNoteText
			}
		]
    }
}
const userSvc = function($http){
    const svc = this

    svc.getUser = () => {
        return  $http({ method: 'GET', url: '/api/users'})
    }

    svc.login = (username, password) =>{
        let obj = {
            username: username,
            password: password
        }

        return $http({ method: 'POST', url: '/api/sessions', data: obj })
        .then((token) => {
            svc.token = token.data
            $http.defaults.headers.common['X-Auth'] = token.data
            sessionStorage.userToken = svc.token
            return svc.getUser()
        })
    }

    svc.logout = () =>{
        delete $http.defaults.headers.common['X-Auth']
    }

    svc.userState = () => {
        if(sessionStorage.userToken){
            svc.token = sessionStorage.userToken
            $http.defaults.headers.common['X-Auth'] = sessionStorage.userToken            
        }
        return svc.getUser()
    }

}
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
var vehicleCardModal = function(){
	return {
		templateUrl: '/templates/modals/vehicle-card-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', function ($scope, $rootScope, $uibModalInstance, $http) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;            

            $scope.vehicleCardsList = [{
                userId: $rootScope.currentUser._id,
                brand: null,
                model: null,
                engine: null,
                milage: null
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
                    brand: null,
                    model: null,
                    engine: null,
                    milage: null
                })
            }

            $scope.show = function(){
                console.log($scope.vehicleCardsList)
            }
  
            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/vehicle-card', data: $scope.vehicleCardsList }).then(
                    function success(response){
                        $scope.$emit('notification', "Dodano kartę pojazdu", "alert-success")
                    }, function error(response){
                        $scope.$emit('notification', `Błąd podczas dodawania karty pojazdu: ${response.data}`, "alert-danger")
                    }
                )
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}
var openVehicleRegisterModal = function(){
	return {
		templateUrl: '/templates/modals/vehicle-register-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance, $http) {
            
            
  
            $scope.yes = function(){
                
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}
angular.module('app-root-controller')

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
    .when('/mainPage'		,{ controller: 'main-page-controller',              templateUrl:'main-page.html'})    
    .when('/clientPage'		,{ controller: 'client-services-page-controller',   templateUrl:'client-services-page.html'})    
    .otherwise({ redirectTo:'/mainPage'})

}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpY3Rpb25hcnktc2VsZWN0LWRpcmVjdGl2ZS5qcyIsImluZm9ybWF0aW9uLW5vdGUtZGlyZWN0aXZlLmpzIiwidXNlci1zZXJ2aWNlLmpzIiwicm9vdC1jb250cm9sbGVyLmpzIiwiY2xpZW50LXNlcnZpY2VzLXBhZ2UuanMiLCJtYWluLXBhZ2UtY29udHJvbGxlci5qcyIsImxvZ2luLW1vZGFsLmpzIiwidXNlci1tYW5hZ2VtZW50LW1vZGFsLmpzIiwidmVoaWNsZS1jYXJkLW1vZGFsLmpzIiwidmVoaWNsZS1yZWdpc3Rlci1tb2RhbC5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNuaWt1d3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzbkRpY3Rpb25hcnlTZWxlY3QgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0FFJyxcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3RlbXBsYXRlcy9kaXJlY3RpdmVzL2RpY3Rpb25hcnktc2VsZWN0Lmh0bWwnLFx0XHRcclxuXHRcdHNjb3BlOiB7XHRcdFxyXG4gICAgICAgICAgICBzblZhbHVlOiAgICAnPScsXHJcbiAgICAgICAgICAgIHNuUGFyYW06ICc9JyxcclxuICAgICAgICAgICAgc25EaWN0S2V5OiAgJz0nLFxyXG4gICAgICAgICAgICBzblBhcmVudEtleTonPT8nLFxyXG4gICAgICAgICAgICBzbkNoYW5nZTogJyYnICAgICAgICAgICAgICAgICBcclxuXHRcdH0sXHJcblx0XHRjb250cm9sbGVyOlsnJHNjb3BlJywgJyRodHRwJyxcclxuXHRcdFx0ZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5pdGVtc0xpc3QgPSBbXSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS5kaWN0SXRlbSA9ICRzY29wZS5zblZhbHVlXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdEV4cGFuZGVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc25WYWx1ZVxyXG5cdFx0XHRcdCRzY29wZS5zbkRpY3RLZXlcclxuXHRcdFx0XHQkc2NvcGUuc25QYXJlbnRLZXlcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXhwYW5kTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLml0ZW1zTGlzdC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RFeHBhbmRlZCA9ICEkc2NvcGUubGlzdEV4cGFuZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5nZXREaWN0aW9uYXJ5ID0gZnVuY3Rpb24odXJsUGFyYW0sIHVybFBhcmVudFBhcmFtKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih1cmxQYXJlbnRQYXJhbSAhPT0gbnVsbCAmJiB1cmxQYXJlbnRQYXJhbSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvZGljdGlvbmFyaWVzLycgKyB1cmxQYXJhbSArICcvJyArIHVybFBhcmVudFBhcmFtfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmRhdGFbMF0gIT09IG51bGwgJiYgcmVzcG9uc2UuZGF0YS5sZW5ndGggIT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNMaXN0ID0gcmVzcG9uc2UuZGF0YVswXS5lbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJHNjb3BlLml0ZW1zTGlzdCA9IFtdICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9TVEVSIFogSU5GT1JNQUNKxIQgTyBCxYFFRFpJRSBQT0JSQU5JQSBEQU5ZQ0ggWkUgU8WBT1dOSUtBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2FwaS9kaWN0aW9uYXJpZXMvJyArIHVybFBhcmFtfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmRhdGEgIT09IG51bGwpICRzY29wZS5pdGVtc0xpc3QgPSByZXNwb25zZS5kYXRhLmVudHJpZXMgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAkc2NvcGUuaXRlbXNMaXN0ID0gW10gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UT1NURVIgWiBJTkZPUk1BQ0rEhCBPIELFgUVEWklFIFBPQlJBTklBIERBTllDSCBaRSBTxYFPV05JS0FcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0SXRlbSA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kaWN0SXRlbSA9IGl0ZW0ua2V5XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNuVmFsdWUgPSBpdGVtLmtleVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0RXhwYW5kZWQgPSBmYWxzZSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3NuVmFsdWUnLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRpY3RJdGVtID0gbmV3VmFsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5zbkRpY3RLZXkgIT09IG51bGwgJiYgJHNjb3BlLnNuRGljdEtleSAhPT0gdW5kZWZpbmVkICYmICRzY29wZS5zblBhcmVudEtleSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldERpY3Rpb25hcnkoJHNjb3BlLnNuRGljdEtleSlcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKCRzY29wZS5zblBhcmVudEtleSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdzblBhcmVudEtleScsIChuZXdLZXksIG9sZEtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihuZXdLZXkgIT09IHVuZGVmaW5lZCAmJiBuZXdLZXkgIT09IG51bGwpeyAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldERpY3Rpb25hcnkoJHNjb3BlLnNuRGljdEtleSwgbmV3S2V5KSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3NuRGljdEtleScsIChuZXdLZXksIG9sZEtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihuZXdLZXkgIT09IHVuZGVmaW5lZCAmJiBuZXdLZXkgIT09IG51bGwpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc25DaGFuZ2UgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXREaWN0aW9uYXJ5KG5ld0tleSkgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cdFx0XHR9XHJcblx0XHRdXHJcbiAgICB9XHJcbn0iLCJjb25zdCBzbkluZm9ybWF0aW9uTm90ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL2RpcmVjdGl2ZXMvaW5mb3JtYXRpb24tbm90ZS5odG1sJyxcdFx0XHJcblx0XHRzY29wZToge1x0XHRcclxuXHRcdFx0c25Ob3RlVGV4dDogJz0nXHJcblx0XHR9LFxyXG5cdFx0Y29udHJvbGxlcjpbJyRzY29wZScsICckaHR0cCcsXHJcblx0XHRcdGZ1bmN0aW9uKCRzY29wZSwgJGh0dHApIHtcclxuXHRcdFx0XHQkc2NvcGUudGV4dCA9ICRzY29wZS5zbk5vdGVUZXh0XHJcblx0XHRcdH1cclxuXHRcdF1cclxuICAgIH1cclxufSIsImNvbnN0IHVzZXJTdmMgPSBmdW5jdGlvbigkaHR0cCl7XHJcbiAgICBjb25zdCBzdmMgPSB0aGlzXHJcblxyXG4gICAgc3ZjLmdldFVzZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdXNlcnMnfSlcclxuICAgIH1cclxuXHJcbiAgICBzdmMubG9naW4gPSAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PntcclxuICAgICAgICBsZXQgb2JqID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRodHRwKHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJy9hcGkvc2Vzc2lvbnMnLCBkYXRhOiBvYmogfSlcclxuICAgICAgICAudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgc3ZjLnRva2VuID0gdG9rZW4uZGF0YVxyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSB0b2tlbi5kYXRhXHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlbiA9IHN2Yy50b2tlblxyXG4gICAgICAgICAgICByZXR1cm4gc3ZjLmdldFVzZXIoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3ZjLmxvZ291dCA9ICgpID0+e1xyXG4gICAgICAgIGRlbGV0ZSAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ11cclxuICAgIH1cclxuXHJcbiAgICBzdmMudXNlclN0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmKHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlbil7XHJcbiAgICAgICAgICAgIHN2Yy50b2tlbiA9IHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlblxyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSBzZXNzaW9uU3RvcmFnZS51c2VyVG9rZW4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKClcclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgYXBwTWFpbkNvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLXJvb3QtY29udHJvbGxlcicsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAnYW5ndWxhcmpzVG9hc3QnXSlcclxuXHJcbi5kaXJlY3RpdmUoJ3NuSW5mb3JtYXRpb25Ob3RlJywgc25JbmZvcm1hdGlvbk5vdGUpXHJcbi5kaXJlY3RpdmUoJ3NuRGljdGlvbmFyeVNlbGVjdCcsIHNuRGljdGlvbmFyeVNlbGVjdClcclxuLnNlcnZpY2UoJ3VzZXJTdmMnLCBbJyRodHRwJywgdXNlclN2Y10pXHJcblxyXG5hcHBNYWluQ29udHJvbGxlci5jb250cm9sbGVyKCdtYWluLWNvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICd1c2VyU3ZjJywgJ3RvYXN0JywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24sIHVzZXJTdmMsIHRvYXN0KXsgICAgXHJcbiAgICBcclxuICAgIHVzZXJTdmMudXNlclN0YXRlKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJ6YWxvZ3VqIHNpxJkgYWJ5IHV6eXNrYcSHIGRvc3TEmXAgZG8gd3N6eXN0a2ljaCBmdW5rY2ppIHNlcndpc3VcIiwgXCJhbGVydC1pbmZvXCIsKSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIClcclxuXHJcbiAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKGV2ZW50LCB1c2VyKXtcclxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlciAgICAgICAgICAgICAgICAgICBcclxuICAgIH0pICAgIFxyXG5cclxuICAgICRzY29wZS4kb24oJ2xvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcclxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpXHJcbiAgICAgICAgdXNlclN2Yy5sb2dvdXQoKVxyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21haW5QYWdlXCIpXHJcbiAgICB9KVxyXG5cclxuICAgICRzY29wZS4kb24oJ25vdGlmaWNhdGlvbicsIGZ1bmN0aW9uKGV2ZW50LCBtZXNzYWdlLCB0eXBlKXtcclxuICAgICAgICB0b2FzdCh7XHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAwLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHR5cGVcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbn1dKSIsImFwcE1haW5Db250cm9sbGVyLmNvbnRyb2xsZXIoJ2NsaWVudC1zZXJ2aWNlcy1wYWdlLWNvbnRyb2xsZXInLCBbJyRzY29wZScsICckdWliTW9kYWwnLCAnJHJvb3RTY29wZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGllbnQgcGFnZVwiKVxyXG5cclxuICAgICAgICAkc2NvcGUub3BlblVzZXJNYW5hZ2VtZW50TW9kYWwgPSBmdW5jdGlvbigpe1x0XHRcdFxyXG5cdFx0XHQkdWliTW9kYWwub3Blbih1c2VyTWFuYWdlbWVudE1vZGFsKCkpLnJlc3VsdC50aGVuKFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdClcclxuXHRcdFx0XHR9LCBmdW5jdGlvbiBlcnJvcihyZXN1bHQpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUub3BlblVzZXJMb2dpbk1vZGFsID0gZnVuY3Rpb24oKXtcdFx0XHRcclxuXHRcdFx0JHVpYk1vZGFsLm9wZW4obG9naW5Nb2RhbCgpKS5yZXN1bHQudGhlbihcclxuXHRcdFx0XHRmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzdWx0KVxyXG5cdFx0XHRcdFx0JHNjb3BlLiRlbWl0KCdub3RpZmljYXRpb24nLCBcIkxvZ293YW5pZSBwb3dpb2TFgm8gc2nEmVwiLCBcImFsZXJ0LXN1Y2Nlc3NcIilcclxuXHRcdFx0XHR9LCBmdW5jdGlvbiBlcnJvcihyZXN1bHQpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5vcGVuVmVoaWNsZUNhcmRNb2RhbCA9IGZ1bmN0aW9uKCl7XHRcdFx0XHJcblx0XHRcdCR1aWJNb2RhbC5vcGVuKHZlaGljbGVDYXJkTW9kYWwoKSlcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUub3BlblZlaGljbGVSZWdpc3Rlck1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHVpYk1vZGFsLm9wZW4oVmVoaWNsZVJlZ2lzdGVyTW9kYWwpXHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XHRcdFx0XHJcblx0XHRcdCRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgYFd5bG9nb3dhbm8gdcW8eXRrb3duaWthICR7JHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VybmFtZX1gLCBcImFsZXJ0LWluZm9cIilcclxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dvdXQnKVx0XHRcdFxyXG5cdFx0fVxyXG5cclxuICAgIH1cclxuXSkiLCJhcHBNYWluQ29udHJvbGxlci5jb250cm9sbGVyKCdtYWluLXBhZ2UtY29udHJvbGxlcicsIFsnJHNjb3BlJywgJyR1aWJNb2RhbCcsICckaHR0cCcsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCwgJGh0dHApe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBwYWdlXCIpICAgIFxyXG4gICAgICAgICRzY29wZS5ub3RlcyA9IFtdO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdGV4dC1ub3RlcycgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgJHNjb3BlLm5vdGVzID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5dKSIsInZhciBsb2dpbk1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL21vZGFscy9sb2dpbi1tb2RhbC5odG1sJyxcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsICAgICAgICAgXHJcbiAgICAgICAgd2luZG93Q2xhc3M6ICdyZXNwb25zaXZlLXNpemUnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6Wyckc2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCAndXNlclN2YycsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkaHR0cCwgdXNlclN2Yykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS51c2VybmFtZSA9IG51bGxcclxuICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID0gbnVsbFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHVzZXJTdmMubG9naW4oJHNjb3BlLnVzZXJuYW1lLCAkc2NvcGUucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHVzZXIuZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcclxuICAgICAgICAgICAgfSkgICAgXHJcblxyXG5cdFx0XHQkc2NvcGUubm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoZmFsc2UpO1xyXG5cdFx0XHR9O1xyXG5cclxuICAgICAgICB9XVxyXG5cdH1cclxufSIsInZhciB1c2VyTWFuYWdlbWVudE1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL21vZGFscy91c2VyLW1hbmFnZW1lbnQtbW9kYWwuaHRtbCcsXHJcbiAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLCAgICAgICAgIFxyXG4gICAgICAgIHdpbmRvd0NsYXNzOiAncmVzcG9uc2l2ZS1zaXplJyxcclxuICAgICAgICBjb250cm9sbGVyOlsnJHNjb3BlJywgJyR1aWJNb2RhbEluc3RhbmNlJywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsICRodHRwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUueWVzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJy9hcGkvdXNlcnMnLCBkYXRhOiAkc2NvcGUudXNlciB9KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1VUV09SWk9OTycsIHJlc3BvbnNlLmRhdGEpXHJcblx0XHRcdCAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEJVTFdPJywgcmVzcG9uc2UuZGF0YSlcclxuICAgICAgICAgICAgICAgIH0pXHRcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG5cdFx0XHQkc2NvcGUubm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoZmFsc2UpO1xyXG5cdFx0XHR9O1xyXG5cclxuICAgICAgICB9XVxyXG5cdH1cclxufSIsInZhciB2ZWhpY2xlQ2FyZE1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL21vZGFscy92ZWhpY2xlLWNhcmQtbW9kYWwuaHRtbCcsXHJcbiAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLCAgICAgICAgIFxyXG4gICAgICAgIHdpbmRvd0NsYXNzOiAncmVzcG9uc2l2ZS1zaXplJyxcclxuICAgICAgICBjb250cm9sbGVyOlsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJGh0dHApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtc1BlclBhZ2UgPSAxOyAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnZlaGljbGVDYXJkc0xpc3QgPSBbe1xyXG4gICAgICAgICAgICAgICAgdXNlcklkOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCxcclxuICAgICAgICAgICAgICAgIGJyYW5kOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbW9kZWw6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlbmdpbmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtaWxhZ2U6IG51bGxcclxuICAgICAgICAgICAgfV07ICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLmNhbGxiYWNrID0gZnVuY3Rpb24oaXRlbSwga2V5LCB0b0RlbGV0ZSwgaW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSAkc2NvcGUudmVoaWNsZUNhcmRzTGlzdFtpbmRleF1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0sIGtleSwgdG9EZWxldGUsIGluZGV4KSBcclxuICAgICAgICAgICAgICAgIGlmKGNhcmRba2V5XSAhPT0gaXRlbSAmJiBjYXJkW2tleV0gIT09IG51bGwpeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdG9EZWxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkW3ZhbHVlXSA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVmVoaWNsZUNhcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZlaGljbGVDYXJkc0xpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBicmFuZDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBlbmdpbmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbWlsYWdlOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudmVoaWNsZUNhcmRzTGlzdClcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICAkc2NvcGUueWVzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJy9hcGkvdmVoaWNsZS1jYXJkJywgZGF0YTogJHNjb3BlLnZlaGljbGVDYXJkc0xpc3QgfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdub3RpZmljYXRpb24nLCBcIkRvZGFubyBrYXJ0xJkgcG9qYXpkdVwiLCBcImFsZXJ0LXN1Y2Nlc3NcIilcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgYELFgsSFZCBwb2RjemFzIGRvZGF3YW5pYSBrYXJ0eSBwb2phemR1OiAke3Jlc3BvbnNlLmRhdGF9YCwgXCJhbGVydC1kYW5nZXJcIilcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdCRzY29wZS5ubyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcyhmYWxzZSk7XHJcblx0XHRcdH07XHJcblxyXG4gICAgICAgIH1dXHJcblx0fVxyXG59IiwidmFyIG9wZW5WZWhpY2xlUmVnaXN0ZXJNb2RhbCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3RlbXBsYXRlcy9tb2RhbHMvdmVoaWNsZS1yZWdpc3Rlci1tb2RhbC5odG1sJyxcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsICAgICAgICAgXHJcbiAgICAgICAgd2luZG93Q2xhc3M6ICdyZXNwb25zaXZlLXNpemUnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6Wyckc2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJGh0dHApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gIFxyXG4gICAgICAgICAgICAkc2NvcGUueWVzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG5cdFx0XHQkc2NvcGUubm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoZmFsc2UpO1xyXG5cdFx0XHR9O1xyXG5cclxuICAgICAgICB9XVxyXG5cdH1cclxufSIsImFuZ3VsYXIubW9kdWxlKCdhcHAtcm9vdC1jb250cm9sbGVyJylcclxuXHJcbi5jb25maWcoW1wiJHJvdXRlUHJvdmlkZXJcIiwgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgLndoZW4oJy9tYWluUGFnZSdcdFx0LHsgY29udHJvbGxlcjogJ21haW4tcGFnZS1jb250cm9sbGVyJywgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOidtYWluLXBhZ2UuaHRtbCd9KSAgICBcclxuICAgIC53aGVuKCcvY2xpZW50UGFnZSdcdFx0LHsgY29udHJvbGxlcjogJ2NsaWVudC1zZXJ2aWNlcy1wYWdlLWNvbnRyb2xsZXInLCAgIHRlbXBsYXRlVXJsOidjbGllbnQtc2VydmljZXMtcGFnZS5odG1sJ30pICAgIFxyXG4gICAgLm90aGVyd2lzZSh7IHJlZGlyZWN0VG86Jy9tYWluUGFnZSd9KVxyXG5cclxufV0pOyJdfQ==
