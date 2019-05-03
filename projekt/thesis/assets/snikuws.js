const snDictionaryList = function(){
    return {
        restrict: 'AE',
		templateUrl: '/templates/directives/dictionary-list.html',		
		scope: {		
            snDictKey: '<',
            snDictParentKey: '<',
            snDictList: '=',
            snChange: '&'
		},
		controller:['$scope', '$http',
			function($scope, $http) {  
                
                $scope.itemsList = []
                $scope.dictionaryList = []

                $scope.$watch('snDictKey', (newKey, oldKey) => {
                    if(newKey !== undefined && newKey !== null) {                         
                        if($scope.snDictKey !== null && $scope.snDictParentKey !== undefined){
                            $http({method: 'GET', url: '/api/dictionaries/' + $scope.snDictKey + '/' + $scope.snDictParentKey}).then(
                                function success(response){
                                    if(response.data[0] !== null && response.data.length !== 0){
                                        $scope.itemsList = response.data[0].entries
                                    }   
                                    else $scope.itemsList = []                            
                                }, function error(response){
                                    //TOSTER Z INFORMACJĄ O BŁEDZIE POBRANIA DANYCH ZE SŁOWNIKA
                                }
                            )                            
                        }
                    }
                })

                $scope.addToDictionaryList = function(service){                           
                    var found = ($scope.dictionaryList.find(function(item, index){ return item.key === service.key }))
                    var index = $scope.dictionaryList.indexOf(found)
                    if(found !== undefined){
                        $scope.dictionaryList.splice(index, 1)
                    }else{
                        $scope.dictionaryList.push(service)
                    } 
                    $scope.snDictList = $scope.dictionaryList
                    $scope.snChange({list : $scope.dictionaryList})                                                                                             
                }
                
                $scope.isChecked = function(service){
                    var found = ($scope.snDictList.find(function(item, index){ return item.key === service.key }))                    
                    if(found !== undefined){
                        return true
                    }else{
                        return false
                    }                     
                }

                $scope.showList = function(){
                    console.log($scope.dictionaryList)
                }

			}
		]
    }
}
const snDictionarySelect = function(){
    return {
        restrict: 'AE',
		templateUrl: '/templates/directives/dictionary-select.html',		
		scope: {		
            snValue:    '=',
            snDesc:     '=',
            snParam:    '=',
            snParam2:   '=',
            snDictKey:  '=',
            snParentKey:'=?',
            snChange:   '&',
            snRequired: '<'               
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
                    $scope.snParam = item.param
                    $scope.snParam2 = item.param2
                    $scope.snDesc = item.description
                    $scope.listExpanded = false                    
                }
                
                $scope.$watch('snValue', function(newVal, oldVal){
                    $scope.dictItem = newVal
                })

                if($scope.snDictKey !== null && $scope.snDictKey !== undefined){
                    $scope.getDictionary($scope.snDictKey, $scope.snParentKey)
                // }else if($scope.snParentKey !== undefined){
                //     $scope.$watch('snParentKey', (newKey, oldKey) => {
                //         if(newKey !== undefined && newKey !== null && $scope.snDictKey !== null){                           
                //             $scope.getDictionary($scope.snDictKey, newKey)                        
                //         } 
                //     })                    
                }else{
                    $scope.$watch('snDictKey', (newKey, oldKey) => {
                        if(newKey !== undefined && newKey !== null) { 
                            $scope.snChange 
                            if($scope.snParentKey !== null && $scope.snParentKey !== undefined){
                                $scope.getDictionary(newKey, $scope.snParentKey)
                            }else{
                                $scope.getDictionary(newKey)                        
                            }                       
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
appMainController.controller('client-services-page-controller', ['$scope', '$uibModal', '$rootScope', '$http',
	function($scope, $uibModal, $rootScope, $http){        
        		
		$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
		.then(function success(response){                    
			if(response.data.length > 0){					
				$scope.vehicleCards = response.data
				$scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
				return $http({method: 'GET', url: '/api/service-orders'})
			}else{
				$scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
			}
		}).then(function success(response){
			$scope.serviceOrders = response.data
			$scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
		})
		
		$scope.vehicleCards = null
		$scope.serviceOrders = null

		$scope.openVehicleCardModal = function(){			
			$uibModal.open(vehicleCardModal())
		}
		
		$scope.openVehicleRegisterModal = function(){
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(vehicleRegisterModal($scope.vehicleCards))			
			})			
		}

		$scope.openOrderingServiceModal = function(){	
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(orderingServicesModal($scope.vehicleCards, $scope.serviceOrders))			
			})		
		}		

		$scope.openServiceManagementModal = function(){
			$http({ method: 'GET', url: '/api/vehicle-card/' + $rootScope.currentUser._id })
			.then(function success(response){                    
				if(response.data.length > 0){					
					$scope.vehicleCards = response.data
					// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich pojazdów", "alert-success")
					return $http({method: 'GET', url: '/api/service-orders'})
				}else{
					// $scope.$emit('notification', "Nie masz jeszcze żadnych zarejestrowanych pojazdów w serwisie", "alert-info")
				}
			}).then(function success(response){
				$scope.serviceOrders = response.data
				// $scope.$emit('notification', "Pomyślnie pobrano listę Twoich zamówień", "alert-success")			
				$uibModal.open(serviceManagementModal($scope.vehicleCards, $scope.serviceOrders))
			})
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
 var orderingServicesModal = function(usersCars, orders, orderToEdit){
	return {
		templateUrl: '/templates/modals/ordering-services-modal.html',
        backdrop: 'static',         
        windowClass: 'max-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', '$uibModal', 'calendarConfig', 'toast',
            function ($scope, $rootScope, $uibModalInstance, $http, $uibModal, calendarConfig, toast) { 
                            
            $scope.calendarView = 'month';  
            $scope.cellIsOpen = true;  
            $scope.allActivities = [];
            $scope.totalHours = 0;    
            $scope.totalMoney = 0;          
            $scope.viewDate = new Date();  
            $scope.orders = orders
            $scope.activeBookmark = 0;
            $scope.events = [];
            $scope.orderToEdit = orderToEdit;
            $scope.serviceType = null;
            $scope.mode = 'ADD'
            
            if($scope.orderToEdit === undefined || $scope.orderToEdit === null){
                $scope.serviceOrder = {
                    userId: $rootScope.currentUser._id,
                    title: null,
                    vehicleCardId: null,
                    dateFrom: null,
                    dateTo: null,
                    servicesList: [],    
                }                                
            }else{
                $scope.serviceOrder = $scope.orderToEdit
                $scope.serviceType = $scope.orderToEdit.servicesList[0].parentKey
                $scope.mode = 'EDIT'
            }

            $scope.updateEvents = function(orders){
                $scope.events = orders.map(function(order){
                    return{
                        title: order.userId === $rootScope.currentUser._id ? order.title : 'Zarezerwowane',
                        startsAt: new Date(order.dateFrom),
                        endsAt: new Date(order.dateTo),
                        duration: moment(order.dateFrom).format('HH:mm') + ' - ' + moment(order.dateTo).format('HH:mm'),                        
                        type: order.userId === $rootScope.currentUser._id ? 'users' : 'occupied',
                        color:  order.userId === $rootScope.currentUser._id ? 'users' : 'occupied',
                    }
                })
                console.log($scope.events)
            }

            $scope.updateEvents($scope.orders)            
            
            $scope.changeBookmark = function(bookmark){
                $scope.activeBookmark = bookmark
            }

            $scope.next = function(){
                $scope.activeBookmark += 1
            }

            $scope.previous = function(){
                $scope.activeBookmark -= 1
            }

            $scope.userVehiclesCards = usersCars.map(function(vehicleCard){
                return {
                    vehicle: `${vehicleCard.brand} ${vehicleCard.carLicensePlates} / ${vehicleCard.model}(${vehicleCard.generation}) ${vehicleCard.engine}`,
                    vehicleCardId: vehicleCard._id
                }
            })     

            $scope.showVehicle = function(){
                if($scope.serviceOrder.vehicleCardId !== null){
                    var car = $scope.userVehiclesCards.find(function(card){
                        return card.vehicleCardId === $scope.serviceOrder.vehicleCardId
                    })
                    return car.vehicle
                }else{
                    return 'Nie wybrano pojazdu'
                }
            }

            $scope.returnOrderDate = function(){
                if($scope.serviceOrder.dateFrom !== null) return moment($scope.serviceOrder.dateFrom).format('YYYY-MM-DD HH:mm')
                else return 'Nie zarezerwowano terminu'
            }

            $scope.bookingDate = function(calendarNextView, calendarDate){
                console.log(calendarNextView)
                if($scope.serviceOrder.servicesList.length > 0){
                    $uibModal.open(orderServiceDateModal(calendarDate, $scope.totalHours)).result.then(
                        function success(result){
                            $scope.serviceOrder.dateFrom = result[0]
                            $scope.serviceOrder.dateTo = result[1]
                        }
                    )
                }else{
                    toast({
                        duration: 5000,
                        message: 'Nie wybrano usług do zarezerwowania terminu',
                        className: 'alert-danger'
                    })
                }
                if(calendarNextView === 'day') return false                                
            }                                                                                  

            $scope.summaryOrder = function(list){
                $scope.totalHours = 0;
                $scope.totalMoney = 0;
                $scope.allActivities = [];                
                $scope.allActivities = list.map(function(order){
                    return {
                        activity: order.key
                    }
                })
                list.forEach(function(order){
                    $scope.totalHours += Number(order.param2.match(/\d+/)[0])
                    $scope.totalMoney += Number(order.param.match(/\d+/)[0])
                })
            }            

            $scope.yes = function(){
                if($scope.mode === 'ADD'){
                    $http({ method: 'POST', url: '/api/service-orders', data: $scope.serviceOrder })
                    .then(function success(response){                    
                        return $http({method: 'GET', url: '/api/service-orders'})			
                    }).then(function success(response){
                        $scope.orders = response.data				
                        $scope.updateEvents($scope.orders)
                    })
                }else{
                    var arr = []
                    arr.push($scope.serviceOrder)
                    $http({ method: 'PATCH', url: '/api/service-orders', data: arr })
                    .then(function success(response){                    
                        return $http({method: 'GET', url: '/api/service-orders'})			
                    }).then(function success(response){
                        $scope.orders = response.data				
                        $scope.updateEvents($scope.orders)
                    })
                }
            }            

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}
var serviceManagementModal = function(vehicleCards, orders){
	return {
		templateUrl: '/templates/modals/service-management-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$uibModal', '$http', 'toast', function ($scope, $rootScope, $uibModalInstance, $uibModal, $http, toast) {
                       
            console.log(vehicleCards)
            console.log(orders)

            $scope.vehicleCards = vehicleCards
            $scope.orders = orders

            $scope.userOrders = orders.filter(function(order){
                return order.userId === $rootScope.currentUser._id
            })

            $scope.no = function(){
                $uibModalInstance.close()
            }

            $scope.orderStatus = function(order){
                if(moment(order.dateFrom) <= moment() && moment(order.dateTo) >= moment() ) return "W trakcie"
                else if(moment(order.dateTo) <= moment()) return "Ukończono"
                else if(moment(order.dateFrom) > moment() ) return "Oczekiwanie"
            }           	

            $scope.deleteOrder = function(order, index){
                $scope.userOrders.splice(index, 1)
                $http({ method: 'DELETE', url: '/api/service-orders/' + order._id })
                    .then(function success(response){
                        toast({
                            duration: 5000,
                            message: 'Usunięto zamówienie',
                            className: 'alert-success'
                        })
                    })
            }

            $scope.editOrder = function(selectedOrder){
                $uibModal.open(orderingServicesModal($scope.vehicleCards, $scope.orders, selectedOrder))    
            }

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
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', 'toast', function ($scope, $rootScope, $uibModalInstance, $http, toast) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;            

            $scope.vehicleCardsList = [{
                userId: $rootScope.currentUser._id,                
                brand:  null,
                model:  null,
                generation: null,
                body:   null,
                fuelType: null,
                engine: null,
                horsepower: null,
                transmissionType: null,
                milage: null,
                carLicensePlates: null,
                yearOfProduction: null,
                serviceHistory: []
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
                    brand:  null,
                    model:  null,
                    body:   null,
                    engine: null,
                    horsepower: null,
                    milage: null,
                    carLicensePlates: null,
                    yearOfProduction: null,
                    serviceHistory: []
                })
            }

            $scope.show = function(){
                console.log($scope.vehicleCardsList)
            }         
            
            $scope.removeVehicleCard = function(cardIndex){
            	$scope.vehicleCardsList.splice(cardIndex, 1)
            }  

            $scope.yes = function(){
                $http({ method: 'POST', url: '/api/vehicle-card', data: $scope.vehicleCardsList }).then(
                    function success(response){
                        toast({
                            duration: 5000,
                            message: 'Dodano kartę pojazdu',
                            className: 'alert-success'
                        })
                        $scope.vehicleCardsList = [{
                            userId: $rootScope.currentUser._id,                
                            brand:  null,
                            model:  null,
                            body:   null,
                            engine: null,
                            horsepower: null,
                            milage: null,
                            carLicensePlates: null,
                            yearOfProduction: null,
                            serviceHistory: []
                        }];          
                    }, function error(response){
                        toast({
                            duration: 5000,
                            message: 'Wystąpił błąd podczas dodawania karty pojazdu',
                            className: 'alert-danger'
                        })
                    }
                )
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}
var vehicleRegisterModal = function(cardList){
	return {
		templateUrl: '/templates/modals/vehicle-register-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$rootScope', '$uibModalInstance', '$http', function ($scope, $rootScope, $uibModalInstance, $http) {
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;
            $scope.vehicleCardsList = cardList;            


  
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpY3Rpb25hcnktbGlzdC1kaXJlY3RpdmUuanMiLCJkaWN0aW9uYXJ5LXNlbGVjdC1kaXJlY3RpdmUuanMiLCJpbmZvcm1hdGlvbi1ub3RlLWRpcmVjdGl2ZS5qcyIsInVzZXItc2VydmljZS5qcyIsInJvb3QtY29udHJvbGxlci5qcyIsImNsaWVudC1zZXJ2aWNlcy1wYWdlLmpzIiwibWFpbi1wYWdlLWNvbnRyb2xsZXIuanMiLCJsb2dpbi1tb2RhbC5qcyIsIm9yZGVyLXNlcnZpY2UtZGF0ZS1tb2RhbC5qcyIsIm9yZGVyaW5nLXNlcnZpY2VzLW1vZGFsLmpzIiwic2VydmljZS1tYW5hZ2VtZW50LW1vZGFsLmpzIiwidXNlci1tYW5hZ2VtZW50LW1vZGFsLmpzIiwidmVoaWNsZS1jYXJkLW1vZGFsLmpzIiwidmVoaWNsZS1yZWdpc3Rlci1tb2RhbC5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNuaWt1d3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzbkRpY3Rpb25hcnlMaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXHJcblx0XHR0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvZGlyZWN0aXZlcy9kaWN0aW9uYXJ5LWxpc3QuaHRtbCcsXHRcdFxyXG5cdFx0c2NvcGU6IHtcdFx0XHJcbiAgICAgICAgICAgIHNuRGljdEtleTogJzwnLFxyXG4gICAgICAgICAgICBzbkRpY3RQYXJlbnRLZXk6ICc8JyxcclxuICAgICAgICAgICAgc25EaWN0TGlzdDogJz0nLFxyXG4gICAgICAgICAgICBzbkNoYW5nZTogJyYnXHJcblx0XHR9LFxyXG5cdFx0Y29udHJvbGxlcjpbJyRzY29wZScsICckaHR0cCcsXHJcblx0XHRcdGZ1bmN0aW9uKCRzY29wZSwgJGh0dHApIHsgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNMaXN0ID0gW11cclxuICAgICAgICAgICAgICAgICRzY29wZS5kaWN0aW9uYXJ5TGlzdCA9IFtdXHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc25EaWN0S2V5JywgKG5ld0tleSwgb2xkS2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobmV3S2V5ICE9PSB1bmRlZmluZWQgJiYgbmV3S2V5ICE9PSBudWxsKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUuc25EaWN0S2V5ICE9PSBudWxsICYmICRzY29wZS5zbkRpY3RQYXJlbnRLZXkgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2FwaS9kaWN0aW9uYXJpZXMvJyArICRzY29wZS5zbkRpY3RLZXkgKyAnLycgKyAkc2NvcGUuc25EaWN0UGFyZW50S2V5fSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuZGF0YVswXSAhPT0gbnVsbCAmJiByZXNwb25zZS5kYXRhLmxlbmd0aCAhPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNMaXN0ID0gcmVzcG9uc2UuZGF0YVswXS5lbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAkc2NvcGUuaXRlbXNMaXN0ID0gW10gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPU1RFUiBaIElORk9STUFDSsSEIE8gQsWBRURaSUUgUE9CUkFOSUEgREFOWUNIIFpFIFPFgU9XTklLQVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5hZGRUb0RpY3Rpb25hcnlMaXN0ID0gZnVuY3Rpb24oc2VydmljZSl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gKCRzY29wZS5kaWN0aW9uYXJ5TGlzdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KXsgcmV0dXJuIGl0ZW0ua2V5ID09PSBzZXJ2aWNlLmtleSB9KSlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkc2NvcGUuZGljdGlvbmFyeUxpc3QuaW5kZXhPZihmb3VuZClcclxuICAgICAgICAgICAgICAgICAgICBpZihmb3VuZCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRpY3Rpb25hcnlMaXN0LnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRpY3Rpb25hcnlMaXN0LnB1c2goc2VydmljZSlcclxuICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zbkRpY3RMaXN0ID0gJHNjb3BlLmRpY3Rpb25hcnlMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNuQ2hhbmdlKHtsaXN0IDogJHNjb3BlLmRpY3Rpb25hcnlMaXN0fSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzQ2hlY2tlZCA9IGZ1bmN0aW9uKHNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9ICgkc2NvcGUuc25EaWN0TGlzdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KXsgcmV0dXJuIGl0ZW0ua2V5ID09PSBzZXJ2aWNlLmtleSB9KSkgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZvdW5kICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNob3dMaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGljdGlvbmFyeUxpc3QpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cdFx0XHR9XHJcblx0XHRdXHJcbiAgICB9XHJcbn0iLCJjb25zdCBzbkRpY3Rpb25hcnlTZWxlY3QgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0FFJyxcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3RlbXBsYXRlcy9kaXJlY3RpdmVzL2RpY3Rpb25hcnktc2VsZWN0Lmh0bWwnLFx0XHRcclxuXHRcdHNjb3BlOiB7XHRcdFxyXG4gICAgICAgICAgICBzblZhbHVlOiAgICAnPScsXHJcbiAgICAgICAgICAgIHNuRGVzYzogICAgICc9JyxcclxuICAgICAgICAgICAgc25QYXJhbTogICAgJz0nLFxyXG4gICAgICAgICAgICBzblBhcmFtMjogICAnPScsXHJcbiAgICAgICAgICAgIHNuRGljdEtleTogICc9JyxcclxuICAgICAgICAgICAgc25QYXJlbnRLZXk6Jz0/JyxcclxuICAgICAgICAgICAgc25DaGFuZ2U6ICAgJyYnLFxyXG4gICAgICAgICAgICBzblJlcXVpcmVkOiAnPCcgICAgICAgICAgICAgICBcclxuXHRcdH0sXHJcblx0XHRjb250cm9sbGVyOlsnJHNjb3BlJywgJyRodHRwJyxcclxuXHRcdFx0ZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5pdGVtc0xpc3QgPSBbXSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS5kaWN0SXRlbSA9ICRzY29wZS5zblZhbHVlXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdEV4cGFuZGVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc25WYWx1ZVxyXG5cdFx0XHRcdCRzY29wZS5zbkRpY3RLZXlcclxuXHRcdFx0XHQkc2NvcGUuc25QYXJlbnRLZXlcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXhwYW5kTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLml0ZW1zTGlzdC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RFeHBhbmRlZCA9ICEkc2NvcGUubGlzdEV4cGFuZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5nZXREaWN0aW9uYXJ5ID0gZnVuY3Rpb24odXJsUGFyYW0sIHVybFBhcmVudFBhcmFtKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih1cmxQYXJlbnRQYXJhbSAhPT0gbnVsbCAmJiB1cmxQYXJlbnRQYXJhbSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvZGljdGlvbmFyaWVzLycgKyB1cmxQYXJhbSArICcvJyArIHVybFBhcmVudFBhcmFtfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmRhdGFbMF0gIT09IG51bGwgJiYgcmVzcG9uc2UuZGF0YS5sZW5ndGggIT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNMaXN0ID0gcmVzcG9uc2UuZGF0YVswXS5lbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJHNjb3BlLml0ZW1zTGlzdCA9IFtdICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9TVEVSIFogSU5GT1JNQUNKxIQgTyBCxYFFRFpJRSBQT0JSQU5JQSBEQU5ZQ0ggWkUgU8WBT1dOSUtBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvZGljdGlvbmFyaWVzLycgKyB1cmxQYXJhbX0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5kYXRhICE9PSBudWxsKSAkc2NvcGUuaXRlbXNMaXN0ID0gcmVzcG9uc2UuZGF0YS5lbnRyaWVzIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJHNjb3BlLml0ZW1zTGlzdCA9IFtdICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9TVEVSIFogSU5GT1JNQUNKxIQgTyBCxYFFRFpJRSBQT0JSQU5JQSBEQU5ZQ0ggWkUgU8WBT1dOSUtBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdEl0ZW0gPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGljdEl0ZW0gPSBpdGVtLmtleVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zblZhbHVlID0gaXRlbS5rZXlcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc25QYXJhbSA9IGl0ZW0ucGFyYW1cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc25QYXJhbTIgPSBpdGVtLnBhcmFtMlxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zbkRlc2MgPSBpdGVtLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RFeHBhbmRlZCA9IGZhbHNlICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc25WYWx1ZScsIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGljdEl0ZW0gPSBuZXdWYWxcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLnNuRGljdEtleSAhPT0gbnVsbCAmJiAkc2NvcGUuc25EaWN0S2V5ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXREaWN0aW9uYXJ5KCRzY29wZS5zbkRpY3RLZXksICRzY29wZS5zblBhcmVudEtleSlcclxuICAgICAgICAgICAgICAgIC8vIH1lbHNlIGlmKCRzY29wZS5zblBhcmVudEtleSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIC8vICAgICAkc2NvcGUuJHdhdGNoKCdzblBhcmVudEtleScsIChuZXdLZXksIG9sZEtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZihuZXdLZXkgIT09IHVuZGVmaW5lZCAmJiBuZXdLZXkgIT09IG51bGwgJiYgJHNjb3BlLnNuRGljdEtleSAhPT0gbnVsbCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUuZ2V0RGljdGlvbmFyeSgkc2NvcGUuc25EaWN0S2V5LCBuZXdLZXkpICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSkgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc25EaWN0S2V5JywgKG5ld0tleSwgb2xkS2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5ld0tleSAhPT0gdW5kZWZpbmVkICYmIG5ld0tleSAhPT0gbnVsbCkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zbkNoYW5nZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5zblBhcmVudEtleSAhPT0gbnVsbCAmJiAkc2NvcGUuc25QYXJlbnRLZXkgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldERpY3Rpb25hcnkobmV3S2V5LCAkc2NvcGUuc25QYXJlbnRLZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0RGljdGlvbmFyeShuZXdLZXkpICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cdFx0XHR9XHJcblx0XHRdXHJcbiAgICB9XHJcbn0iLCJjb25zdCBzbkluZm9ybWF0aW9uTm90ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL2RpcmVjdGl2ZXMvaW5mb3JtYXRpb24tbm90ZS5odG1sJyxcdFx0XHJcblx0XHRzY29wZToge1x0XHRcclxuXHRcdFx0c25Ob3RlVGV4dDogJz0nXHJcblx0XHR9LFxyXG5cdFx0Y29udHJvbGxlcjpbJyRzY29wZScsICckaHR0cCcsXHJcblx0XHRcdGZ1bmN0aW9uKCRzY29wZSwgJGh0dHApIHtcclxuXHRcdFx0XHQkc2NvcGUudGV4dCA9ICRzY29wZS5zbk5vdGVUZXh0XHJcblx0XHRcdH1cclxuXHRcdF1cclxuICAgIH1cclxufSIsImNvbnN0IHVzZXJTdmMgPSBmdW5jdGlvbigkaHR0cCl7XHJcbiAgICBjb25zdCBzdmMgPSB0aGlzXHJcblxyXG4gICAgc3ZjLmdldFVzZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdXNlcnMnfSlcclxuICAgIH1cclxuXHJcbiAgICBzdmMubG9naW4gPSAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PntcclxuICAgICAgICBsZXQgb2JqID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRodHRwKHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJy9hcGkvc2Vzc2lvbnMnLCBkYXRhOiBvYmogfSlcclxuICAgICAgICAudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgc3ZjLnRva2VuID0gdG9rZW4uZGF0YVxyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSB0b2tlbi5kYXRhXHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlbiA9IHN2Yy50b2tlblxyXG4gICAgICAgICAgICByZXR1cm4gc3ZjLmdldFVzZXIoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3ZjLmxvZ291dCA9ICgpID0+e1xyXG4gICAgICAgIGRlbGV0ZSAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ11cclxuICAgIH1cclxuXHJcbiAgICBzdmMudXNlclN0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmKHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlbil7XHJcbiAgICAgICAgICAgIHN2Yy50b2tlbiA9IHNlc3Npb25TdG9yYWdlLnVzZXJUb2tlblxyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSBzZXNzaW9uU3RvcmFnZS51c2VyVG9rZW4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKClcclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgYXBwTWFpbkNvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLXJvb3QtY29udHJvbGxlcicsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAnYW5ndWxhcmpzVG9hc3QnLCAnbXdsLmNhbGVuZGFyJ10pXHJcblxyXG4uZGlyZWN0aXZlKCdzbkluZm9ybWF0aW9uTm90ZScsIHNuSW5mb3JtYXRpb25Ob3RlKVxyXG4uZGlyZWN0aXZlKCdzbkRpY3Rpb25hcnlTZWxlY3QnLCBzbkRpY3Rpb25hcnlTZWxlY3QpXHJcbi5kaXJlY3RpdmUoJ3NuRGljdGlvbmFyeUxpc3QnLCBzbkRpY3Rpb25hcnlMaXN0KVxyXG4uc2VydmljZSgndXNlclN2YycsIFsnJGh0dHAnLCB1c2VyU3ZjXSlcclxuLmNvbmZpZyhbJ2NhbGVuZGFyQ29uZmlnJywgZnVuY3Rpb24oY2FsZW5kYXJDb25maWcpe1xyXG4gICAgY29uc29sZS5sb2coY2FsZW5kYXJDb25maWcpXHJcbiAgICBtb21lbnQubG9jYWxlKCdwbCcpXHJcbiAgICBjYWxlbmRhckNvbmZpZy5kYXRlRm9ybWF0dGVyID0gJ21vbWVudCdcclxuICAgIGNhbGVuZGFyQ29uZmlnLmkxOG5TdHJpbmdzLndlZWtOdW1iZXIgPSAnVHlnLiB7d2Vla30nXHJcbiAgICBjYWxlbmRhckNvbmZpZy5hbGxEYXRlRm9ybWF0cy5tb21lbnQuZGF0ZS5ob3VyID0gJ0hIOm1tJztcclxuICAgIGNhbGVuZGFyQ29uZmlnLmNvbG9yVHlwZXMgPSB7XHJcbiAgICAgICAgb2NjdXBpZWQ6ICdyZWQnLFxyXG4gICAgICAgIHVzZXJzOiAnYmx1ZSdcclxuICAgIH1cclxuXHJcbn1dKVxyXG5cclxuYXBwTWFpbkNvbnRyb2xsZXIuY29udHJvbGxlcignbWFpbi1jb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCckdWliTW9kYWwnLCAndXNlclN2YycsICd0b2FzdCcsICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgJHVpYk1vZGFsLCB1c2VyU3ZjLCB0b2FzdCl7ICAgIFxyXG4gICAgXHJcbiAgICB1c2VyU3ZjLnVzZXJTdGF0ZSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiemFsb2d1aiBzacSZIGFieSB1enlza2HEhyBkb3N0xJlwIGRvIHdzenlzdGtpY2ggZnVua2NqaSBzZXJ3aXN1XCIsIFwiYWxlcnQtaW5mb1wiLCkgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICApXHJcblxyXG4gICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihldmVudCwgdXNlcil7XHJcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXIgICAgICAgICAgICAgICAgICAgXHJcbiAgICB9KSAgICBcclxuXHJcbiAgICAkc2NvcGUuJG9uKCdsb2dvdXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsXHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKVxyXG4gICAgICAgIHVzZXJTdmMubG9nb3V0KClcclxuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tYWluUGFnZVwiKVxyXG4gICAgfSlcclxuXHJcbiAgICAkc2NvcGUuJG9uKCdub3RpZmljYXRpb24nLCBmdW5jdGlvbihldmVudCwgbWVzc2FnZSwgdHlwZSl7XHJcbiAgICAgICAgdG9hc3Qoe1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogNTAwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiB0eXBlXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJHNjb3BlLm9wZW5Vc2VyTWFuYWdlbWVudE1vZGFsID0gZnVuY3Rpb24oKXtcdFx0XHRcclxuICAgICAgICAkdWliTW9kYWwub3Blbih1c2VyTWFuYWdlbWVudE1vZGFsKCkpLnJlc3VsdC50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGVycm9yKHJlc3VsdCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgICRzY29wZS5vcGVuVXNlckxvZ2luTW9kYWwgPSBmdW5jdGlvbigpe1x0XHRcdFxyXG4gICAgICAgICR1aWJNb2RhbC5vcGVuKGxvZ2luTW9kYWwoKSkucmVzdWx0LnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCByZXN1bHQpXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiTG9nb3dhbmllIHBvd2lvZMWCbyBzacSZXCIsIFwiYWxlcnQtc3VjY2Vzc1wiKVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1x0XHRcdFxyXG4gICAgICAgICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgYFd5bG9nb3dhbm8gdcW8eXRrb3duaWthICR7JHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VybmFtZX1gLCBcImFsZXJ0LWluZm9cIilcclxuICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ291dCcpXHRcdFx0XHJcbiAgICB9XHJcblxyXG59XSkiLCJhcHBNYWluQ29udHJvbGxlci5jb250cm9sbGVyKCdjbGllbnQtc2VydmljZXMtcGFnZS1jb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHVpYk1vZGFsJywgJyRyb290U2NvcGUnLCAnJGh0dHAnLFxyXG5cdGZ1bmN0aW9uKCRzY29wZSwgJHVpYk1vZGFsLCAkcm9vdFNjb3BlLCAkaHR0cCl7ICAgICAgICBcclxuICAgICAgICBcdFx0XHJcblx0XHQkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdmVoaWNsZS1jYXJkLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCB9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICBcclxuXHRcdFx0aWYocmVzcG9uc2UuZGF0YS5sZW5ndGggPiAwKXtcdFx0XHRcdFx0XHJcblx0XHRcdFx0JHNjb3BlLnZlaGljbGVDYXJkcyA9IHJlc3BvbnNlLmRhdGFcclxuXHRcdFx0XHQkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiUG9tecWbbG5pZSBwb2JyYW5vIGxpc3TEmSBUd29pY2ggcG9qYXpkw7N3XCIsIFwiYWxlcnQtc3VjY2Vzc1wiKVxyXG5cdFx0XHRcdHJldHVybiAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2FwaS9zZXJ2aWNlLW9yZGVycyd9KVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiTmllIG1hc3ogamVzemN6ZSDFvGFkbnljaCB6YXJlamVzdHJvd2FueWNoIHBvamF6ZMOzdyB3IHNlcndpc2llXCIsIFwiYWxlcnQtaW5mb1wiKVxyXG5cdFx0XHR9XHJcblx0XHR9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG5cdFx0XHQkc2NvcGUuc2VydmljZU9yZGVycyA9IHJlc3BvbnNlLmRhdGFcclxuXHRcdFx0JHNjb3BlLiRlbWl0KCdub3RpZmljYXRpb24nLCBcIlBvbXnFm2xuaWUgcG9icmFubyBsaXN0xJkgVHdvaWNoIHphbcOzd2llxYRcIiwgXCJhbGVydC1zdWNjZXNzXCIpXHRcdFx0XHJcblx0XHR9KVxyXG5cdFx0XHJcblx0XHQkc2NvcGUudmVoaWNsZUNhcmRzID0gbnVsbFxyXG5cdFx0JHNjb3BlLnNlcnZpY2VPcmRlcnMgPSBudWxsXHJcblxyXG5cdFx0JHNjb3BlLm9wZW5WZWhpY2xlQ2FyZE1vZGFsID0gZnVuY3Rpb24oKXtcdFx0XHRcclxuXHRcdFx0JHVpYk1vZGFsLm9wZW4odmVoaWNsZUNhcmRNb2RhbCgpKVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkc2NvcGUub3BlblZlaGljbGVSZWdpc3Rlck1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL3ZlaGljbGUtY2FyZC8nICsgJHJvb3RTY29wZS5jdXJyZW50VXNlci5faWQgfSlcclxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICBcclxuXHRcdFx0XHRpZihyZXNwb25zZS5kYXRhLmxlbmd0aCA+IDApe1x0XHRcdFx0XHRcclxuXHRcdFx0XHRcdCRzY29wZS52ZWhpY2xlQ2FyZHMgPSByZXNwb25zZS5kYXRhXHJcblx0XHRcdFx0XHQvLyAkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiUG9tecWbbG5pZSBwb2JyYW5vIGxpc3TEmSBUd29pY2ggcG9qYXpkw7N3XCIsIFwiYWxlcnQtc3VjY2Vzc1wiKVxyXG5cdFx0XHRcdFx0cmV0dXJuICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL3NlcnZpY2Utb3JkZXJzJ30pXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiTmllIG1hc3ogamVzemN6ZSDFvGFkbnljaCB6YXJlamVzdHJvd2FueWNoIHBvamF6ZMOzdyB3IHNlcndpc2llXCIsIFwiYWxlcnQtaW5mb1wiKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuXHRcdFx0XHQkc2NvcGUuc2VydmljZU9yZGVycyA9IHJlc3BvbnNlLmRhdGFcclxuXHRcdFx0XHQvLyAkc2NvcGUuJGVtaXQoJ25vdGlmaWNhdGlvbicsIFwiUG9tecWbbG5pZSBwb2JyYW5vIGxpc3TEmSBUd29pY2ggemFtw7N3aWXFhFwiLCBcImFsZXJ0LXN1Y2Nlc3NcIilcdFx0XHRcclxuXHRcdFx0XHQkdWliTW9kYWwub3Blbih2ZWhpY2xlUmVnaXN0ZXJNb2RhbCgkc2NvcGUudmVoaWNsZUNhcmRzKSlcdFx0XHRcclxuXHRcdFx0fSlcdFx0XHRcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUub3Blbk9yZGVyaW5nU2VydmljZU1vZGFsID0gZnVuY3Rpb24oKXtcdFxyXG5cdFx0XHQkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdmVoaWNsZS1jYXJkLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCB9KVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgICAgIFxyXG5cdFx0XHRcdGlmKHJlc3BvbnNlLmRhdGEubGVuZ3RoID4gMCl7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLnZlaGljbGVDYXJkcyA9IHJlc3BvbnNlLmRhdGFcclxuXHRcdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJQb215xZtsbmllIHBvYnJhbm8gbGlzdMSZIFR3b2ljaCBwb2phemTDs3dcIiwgXCJhbGVydC1zdWNjZXNzXCIpXHJcblx0XHRcdFx0XHRyZXR1cm4gJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvc2VydmljZS1vcmRlcnMnfSlcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJOaWUgbWFzeiBqZXN6Y3plIMW8YWRueWNoIHphcmVqZXN0cm93YW55Y2ggcG9qYXpkw7N3IHcgc2Vyd2lzaWVcIiwgXCJhbGVydC1pbmZvXCIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG5cdFx0XHRcdCRzY29wZS5zZXJ2aWNlT3JkZXJzID0gcmVzcG9uc2UuZGF0YVxyXG5cdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJQb215xZtsbmllIHBvYnJhbm8gbGlzdMSZIFR3b2ljaCB6YW3Ds3dpZcWEXCIsIFwiYWxlcnQtc3VjY2Vzc1wiKVx0XHRcdFxyXG5cdFx0XHRcdCR1aWJNb2RhbC5vcGVuKG9yZGVyaW5nU2VydmljZXNNb2RhbCgkc2NvcGUudmVoaWNsZUNhcmRzLCAkc2NvcGUuc2VydmljZU9yZGVycykpXHRcdFx0XHJcblx0XHRcdH0pXHRcdFxyXG5cdFx0fVx0XHRcclxuXHJcblx0XHQkc2NvcGUub3BlblNlcnZpY2VNYW5hZ2VtZW50TW9kYWwgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdmVoaWNsZS1jYXJkLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCB9KVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgICAgIFxyXG5cdFx0XHRcdGlmKHJlc3BvbnNlLmRhdGEubGVuZ3RoID4gMCl7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLnZlaGljbGVDYXJkcyA9IHJlc3BvbnNlLmRhdGFcclxuXHRcdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJQb215xZtsbmllIHBvYnJhbm8gbGlzdMSZIFR3b2ljaCBwb2phemTDs3dcIiwgXCJhbGVydC1zdWNjZXNzXCIpXHJcblx0XHRcdFx0XHRyZXR1cm4gJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvc2VydmljZS1vcmRlcnMnfSlcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJOaWUgbWFzeiBqZXN6Y3plIMW8YWRueWNoIHphcmVqZXN0cm93YW55Y2ggcG9qYXpkw7N3IHcgc2Vyd2lzaWVcIiwgXCJhbGVydC1pbmZvXCIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG5cdFx0XHRcdCRzY29wZS5zZXJ2aWNlT3JkZXJzID0gcmVzcG9uc2UuZGF0YVxyXG5cdFx0XHRcdC8vICRzY29wZS4kZW1pdCgnbm90aWZpY2F0aW9uJywgXCJQb215xZtsbmllIHBvYnJhbm8gbGlzdMSZIFR3b2ljaCB6YW3Ds3dpZcWEXCIsIFwiYWxlcnQtc3VjY2Vzc1wiKVx0XHRcdFxyXG5cdFx0XHRcdCR1aWJNb2RhbC5vcGVuKHNlcnZpY2VNYW5hZ2VtZW50TW9kYWwoJHNjb3BlLnZlaGljbGVDYXJkcywgJHNjb3BlLnNlcnZpY2VPcmRlcnMpKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuICAgIH1cclxuXSkiLCJhcHBNYWluQ29udHJvbGxlci5jb250cm9sbGVyKCdtYWluLXBhZ2UtY29udHJvbGxlcicsIFsnJHNjb3BlJywgJyR1aWJNb2RhbCcsICckaHR0cCcsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCwgJGh0dHApe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBwYWdlXCIpICAgIFxyXG4gICAgICAgICRzY29wZS5ub3RlcyA9IFtdO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdGV4dC1ub3RlcycgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgJHNjb3BlLm5vdGVzID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5dKSIsInZhciBsb2dpbk1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdGVtcGxhdGVzL21vZGFscy9sb2dpbi1tb2RhbC5odG1sJyxcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsICAgICAgICAgXHJcbiAgICAgICAgd2luZG93Q2xhc3M6ICdyZXNwb25zaXZlLXNpemUnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6Wyckc2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCAndXNlclN2YycsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkaHR0cCwgdXNlclN2Yykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS51c2VybmFtZSA9IG51bGxcclxuICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID0gbnVsbFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHVzZXJTdmMubG9naW4oJHNjb3BlLnVzZXJuYW1lLCAkc2NvcGUucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHVzZXIuZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcclxuICAgICAgICAgICAgfSkgICAgXHJcblxyXG5cdFx0XHQkc2NvcGUubm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoZmFsc2UpO1xyXG5cdFx0XHR9O1xyXG5cclxuICAgICAgICB9XVxyXG5cdH1cclxufSIsInZhciBvcmRlclNlcnZpY2VEYXRlTW9kYWwgPSBmdW5jdGlvbihjYWxlbmRhckRhdGUsIHRvdGFsSG91cnMpe1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvbW9kYWxzL29yZGVyLXNlcnZpY2UtZGF0ZS1tb2RhbC5odG1sJyxcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsICAgICAgICAgXHJcbiAgICAgICAgd2luZG93Q2xhc3M6ICdyZXNwb25zaXZlLXNpemUnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6Wyckc2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCAndXNlclN2YycsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkaHR0cCwgdXNlclN2Yykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS5jYWxlbmRhckRhdGUgPSBjYWxlbmRhckRhdGVcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oc3RlcCA9IDFcclxuICAgICAgICAgICAgJHNjb3BlLm1zdGVwID0gNjBcclxuICAgICAgICAgICAgJHNjb3BlLnN0YXJ0c0F0ID0gbW9tZW50KGNhbGVuZGFyRGF0ZSkuYWRkKG1vbWVudCgpLmhvdXJzKCksICdob3VycycpLmZvcm1hdCgpXHJcbiAgICAgICAgICAgICRzY29wZS5lbmRzQXQgPSBtb21lbnQoJHNjb3BlLnN0YXJ0c0F0KS5hZGQodG90YWxIb3VycywgJ2hvdXJzJykuZm9ybWF0KClcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGFuZ2VkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5lbmRzQXQgPSBtb21lbnQoJHNjb3BlLnN0YXJ0c0F0KS5hZGQodG90YWxIb3VycywgJ2hvdXJzJykuZm9ybWF0KClcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0JHNjb3BlLm5vID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKGZhbHNlKTtcclxuXHRcdFx0fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS55ZXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVzID0gWyRzY29wZS5zdGFydHNBdCwgJHNjb3BlLmVuZHNBdF1cclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKGRhdGVzKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1dXHJcblx0fVxyXG59IiwiIHZhciBvcmRlcmluZ1NlcnZpY2VzTW9kYWwgPSBmdW5jdGlvbih1c2Vyc0NhcnMsIG9yZGVycywgb3JkZXJUb0VkaXQpe1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvbW9kYWxzL29yZGVyaW5nLXNlcnZpY2VzLW1vZGFsLmh0bWwnLFxyXG4gICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJywgICAgICAgICBcclxuICAgICAgICB3aW5kb3dDbGFzczogJ21heC1zaXplJyxcclxuICAgICAgICBjb250cm9sbGVyOlsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCAnJHVpYk1vZGFsJywgJ2NhbGVuZGFyQ29uZmlnJywgJ3RvYXN0JyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsICRodHRwLCAkdWliTW9kYWwsIGNhbGVuZGFyQ29uZmlnLCB0b2FzdCkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkc2NvcGUuY2FsZW5kYXJWaWV3ID0gJ21vbnRoJzsgIFxyXG4gICAgICAgICAgICAkc2NvcGUuY2VsbElzT3BlbiA9IHRydWU7ICBcclxuICAgICAgICAgICAgJHNjb3BlLmFsbEFjdGl2aXRpZXMgPSBbXTtcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsSG91cnMgPSAwOyAgICBcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsTW9uZXkgPSAwOyAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLnZpZXdEYXRlID0gbmV3IERhdGUoKTsgIFxyXG4gICAgICAgICAgICAkc2NvcGUub3JkZXJzID0gb3JkZXJzXHJcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVCb29rbWFyayA9IDA7XHJcbiAgICAgICAgICAgICRzY29wZS5ldmVudHMgPSBbXTtcclxuICAgICAgICAgICAgJHNjb3BlLm9yZGVyVG9FZGl0ID0gb3JkZXJUb0VkaXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5zZXJ2aWNlVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS5tb2RlID0gJ0FERCdcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5vcmRlclRvRWRpdCA9PT0gdW5kZWZpbmVkIHx8ICRzY29wZS5vcmRlclRvRWRpdCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VydmljZU9yZGVyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogJHJvb3RTY29wZS5jdXJyZW50VXNlci5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgdmVoaWNsZUNhcmRJZDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlRnJvbTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlVG86IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZXNMaXN0OiBbXSwgICAgXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VydmljZU9yZGVyID0gJHNjb3BlLm9yZGVyVG9FZGl0XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VydmljZVR5cGUgPSAkc2NvcGUub3JkZXJUb0VkaXQuc2VydmljZXNMaXN0WzBdLnBhcmVudEtleVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vZGUgPSAnRURJVCdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKG9yZGVycyl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnRzID0gb3JkZXJzLm1hcChmdW5jdGlvbihvcmRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogb3JkZXIudXNlcklkID09PSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCA/IG9yZGVyLnRpdGxlIDogJ1phcmV6ZXJ3b3dhbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydHNBdDogbmV3IERhdGUob3JkZXIuZGF0ZUZyb20pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRzQXQ6IG5ldyBEYXRlKG9yZGVyLmRhdGVUbyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBtb21lbnQob3JkZXIuZGF0ZUZyb20pLmZvcm1hdCgnSEg6bW0nKSArICcgLSAnICsgbW9tZW50KG9yZGVyLmRhdGVUbykuZm9ybWF0KCdISDptbScpLCAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBvcmRlci51c2VySWQgPT09ICRyb290U2NvcGUuY3VycmVudFVzZXIuX2lkID8gJ3VzZXJzJyA6ICdvY2N1cGllZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAgb3JkZXIudXNlcklkID09PSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCA/ICd1c2VycycgOiAnb2NjdXBpZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZXZlbnRzKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlRXZlbnRzKCRzY29wZS5vcmRlcnMpICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkc2NvcGUuY2hhbmdlQm9va21hcmsgPSBmdW5jdGlvbihib29rbWFyayl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWN0aXZlQm9va21hcmsgPSBib29rbWFya1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWN0aXZlQm9va21hcmsgKz0gMVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJldmlvdXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZUJvb2ttYXJrIC09IDFcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJWZWhpY2xlc0NhcmRzID0gdXNlcnNDYXJzLm1hcChmdW5jdGlvbih2ZWhpY2xlQ2FyZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZlaGljbGU6IGAke3ZlaGljbGVDYXJkLmJyYW5kfSAke3ZlaGljbGVDYXJkLmNhckxpY2Vuc2VQbGF0ZXN9IC8gJHt2ZWhpY2xlQ2FyZC5tb2RlbH0oJHt2ZWhpY2xlQ2FyZC5nZW5lcmF0aW9ufSkgJHt2ZWhpY2xlQ2FyZC5lbmdpbmV9YCxcclxuICAgICAgICAgICAgICAgICAgICB2ZWhpY2xlQ2FyZElkOiB2ZWhpY2xlQ2FyZC5faWRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkgICAgIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dWZWhpY2xlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5zZXJ2aWNlT3JkZXIudmVoaWNsZUNhcmRJZCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhciA9ICRzY29wZS51c2VyVmVoaWNsZXNDYXJkcy5maW5kKGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FyZC52ZWhpY2xlQ2FyZElkID09PSAkc2NvcGUuc2VydmljZU9yZGVyLnZlaGljbGVDYXJkSWRcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXIudmVoaWNsZVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdOaWUgd3licmFubyBwb2phemR1J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmV0dXJuT3JkZXJEYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5zZXJ2aWNlT3JkZXIuZGF0ZUZyb20gIT09IG51bGwpIHJldHVybiBtb21lbnQoJHNjb3BlLnNlcnZpY2VPcmRlci5kYXRlRnJvbSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJylcclxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuICdOaWUgemFyZXplcndvd2FubyB0ZXJtaW51J1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYm9va2luZ0RhdGUgPSBmdW5jdGlvbihjYWxlbmRhck5leHRWaWV3LCBjYWxlbmRhckRhdGUpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2FsZW5kYXJOZXh0VmlldylcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5zZXJ2aWNlT3JkZXIuc2VydmljZXNMaXN0Lmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbC5vcGVuKG9yZGVyU2VydmljZURhdGVNb2RhbChjYWxlbmRhckRhdGUsICRzY29wZS50b3RhbEhvdXJzKSkucmVzdWx0LnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zZXJ2aWNlT3JkZXIuZGF0ZUZyb20gPSByZXN1bHRbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zZXJ2aWNlT3JkZXIuZGF0ZVRvID0gcmVzdWx0WzFdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTmllIHd5YnJhbm8gdXPFgnVnIGRvIHphcmV6ZXJ3b3dhbmlhIHRlcm1pbnUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1kYW5nZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGNhbGVuZGFyTmV4dFZpZXcgPT09ICdkYXknKSByZXR1cm4gZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnN1bW1hcnlPcmRlciA9IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsSG91cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsTW9uZXkgPSAwO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsbEFjdGl2aXRpZXMgPSBbXTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxsQWN0aXZpdGllcyA9IGxpc3QubWFwKGZ1bmN0aW9uKG9yZGVyKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0eTogb3JkZXIua2V5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihvcmRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsSG91cnMgKz0gTnVtYmVyKG9yZGVyLnBhcmFtMi5tYXRjaCgvXFxkKy8pWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50b3RhbE1vbmV5ICs9IE51bWJlcihvcmRlci5wYXJhbS5tYXRjaCgvXFxkKy8pWzBdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnllcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUubW9kZSA9PT0gJ0FERCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJy9hcGkvc2VydmljZS1vcmRlcnMnLCBkYXRhOiAkc2NvcGUuc2VydmljZU9yZGVyIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL3NlcnZpY2Utb3JkZXJzJ30pXHRcdFx0XHJcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9yZGVycyA9IHJlc3BvbnNlLmRhdGFcdFx0XHRcdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRXZlbnRzKCRzY29wZS5vcmRlcnMpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKCRzY29wZS5zZXJ2aWNlT3JkZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdQQVRDSCcsIHVybDogJy9hcGkvc2VydmljZS1vcmRlcnMnLCBkYXRhOiBhcnIgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvc2VydmljZS1vcmRlcnMnfSlcdFx0XHRcclxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3JkZXJzID0gcmVzcG9uc2UuZGF0YVx0XHRcdFx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVFdmVudHMoJHNjb3BlLm9yZGVycylcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcblxyXG5cdFx0XHQkc2NvcGUubm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoZmFsc2UpO1xyXG5cdFx0XHR9O1xyXG5cclxuICAgICAgICB9XVxyXG5cdH1cclxufSIsInZhciBzZXJ2aWNlTWFuYWdlbWVudE1vZGFsID0gZnVuY3Rpb24odmVoaWNsZUNhcmRzLCBvcmRlcnMpe1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvbW9kYWxzL3NlcnZpY2UtbWFuYWdlbWVudC1tb2RhbC5odG1sJyxcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsICAgICAgICAgXHJcbiAgICAgICAgd2luZG93Q2xhc3M6ICdyZXNwb25zaXZlLXNpemUnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6Wyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdWliTW9kYWxJbnN0YW5jZScsICckdWliTW9kYWwnLCAnJGh0dHAnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJHVpYk1vZGFsLCAkaHR0cCwgdG9hc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2codmVoaWNsZUNhcmRzKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlcnMpXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudmVoaWNsZUNhcmRzID0gdmVoaWNsZUNhcmRzXHJcbiAgICAgICAgICAgICRzY29wZS5vcmRlcnMgPSBvcmRlcnNcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51c2VyT3JkZXJzID0gb3JkZXJzLmZpbHRlcihmdW5jdGlvbihvcmRlcil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIudXNlcklkID09PSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm5vID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9yZGVyU3RhdHVzID0gZnVuY3Rpb24ob3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgaWYobW9tZW50KG9yZGVyLmRhdGVGcm9tKSA8PSBtb21lbnQoKSAmJiBtb21lbnQob3JkZXIuZGF0ZVRvKSA+PSBtb21lbnQoKSApIHJldHVybiBcIlcgdHJha2NpZVwiXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKG1vbWVudChvcmRlci5kYXRlVG8pIDw9IG1vbWVudCgpKSByZXR1cm4gXCJVa2/FhGN6b25vXCJcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYobW9tZW50KG9yZGVyLmRhdGVGcm9tKSA+IG1vbWVudCgpICkgcmV0dXJuIFwiT2N6ZWtpd2FuaWVcIlxyXG4gICAgICAgICAgICB9ICAgICAgICAgICBcdFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZU9yZGVyID0gZnVuY3Rpb24ob3JkZXIsIGluZGV4KXtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyT3JkZXJzLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnREVMRVRFJywgdXJsOiAnL2FwaS9zZXJ2aWNlLW9yZGVycy8nICsgb3JkZXIuX2lkIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzdW5pxJl0byB6YW3Ds3dpZW5pZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1zdWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0T3JkZXIgPSBmdW5jdGlvbihzZWxlY3RlZE9yZGVyKXtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbC5vcGVuKG9yZGVyaW5nU2VydmljZXNNb2RhbCgkc2NvcGUudmVoaWNsZUNhcmRzLCAkc2NvcGUub3JkZXJzLCBzZWxlY3RlZE9yZGVyKSkgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfV1cclxuXHR9XHJcbn0iLCJ2YXIgdXNlck1hbmFnZW1lbnRNb2RhbCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3RlbXBsYXRlcy9tb2RhbHMvdXNlci1tYW5hZ2VtZW50LW1vZGFsLmh0bWwnLFxyXG4gICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJywgICAgICAgICBcclxuICAgICAgICB3aW5kb3dDbGFzczogJ3Jlc3BvbnNpdmUtc2l6ZScsXHJcbiAgICAgICAgY29udHJvbGxlcjpbJyRzY29wZScsICckdWliTW9kYWxJbnN0YW5jZScsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkaHR0cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHtcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IG51bGxcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnllcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ1BPU1QnLCB1cmw6ICcvYXBpL3VzZXJzJywgZGF0YTogJHNjb3BlLnVzZXIgfSlcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdVVFdPUlpPTk8nLCByZXNwb25zZS5kYXRhKVxyXG5cdFx0XHQgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUiBCVUxXTycsIHJlc3BvbnNlLmRhdGEpXHJcbiAgICAgICAgICAgICAgICB9KVx0XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0JHNjb3BlLm5vID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKGZhbHNlKTtcclxuXHRcdFx0fTtcclxuXHJcbiAgICAgICAgfV1cclxuXHR9XHJcbn0iLCJ2YXIgdmVoaWNsZUNhcmRNb2RhbCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3RlbXBsYXRlcy9tb2RhbHMvdmVoaWNsZS1jYXJkLW1vZGFsLmh0bWwnLFxyXG4gICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJywgICAgICAgICBcclxuICAgICAgICB3aW5kb3dDbGFzczogJ3Jlc3BvbnNpdmUtc2l6ZScsXHJcbiAgICAgICAgY29udHJvbGxlcjpbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyR1aWJNb2RhbEluc3RhbmNlJywgJyRodHRwJywgJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsICRodHRwLCB0b2FzdCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgJHNjb3BlLml0ZW1zUGVyUGFnZSA9IDE7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudmVoaWNsZUNhcmRzTGlzdCA9IFt7XHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6ICRyb290U2NvcGUuY3VycmVudFVzZXIuX2lkLCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyYW5kOiAgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1vZGVsOiAgbnVsbCxcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRpb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICBib2R5OiAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBmdWVsVHlwZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGVuZ2luZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGhvcnNlcG93ZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB0cmFuc21pc3Npb25UeXBlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWlsYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY2FyTGljZW5zZVBsYXRlczogbnVsbCxcclxuICAgICAgICAgICAgICAgIHllYXJPZlByb2R1Y3Rpb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlSGlzdG9yeTogW11cclxuICAgICAgICAgICAgfV07ICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLmNhbGxiYWNrID0gZnVuY3Rpb24oaXRlbSwga2V5LCB0b0RlbGV0ZSwgaW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSAkc2NvcGUudmVoaWNsZUNhcmRzTGlzdFtpbmRleF1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0sIGtleSwgdG9EZWxldGUsIGluZGV4KSBcclxuICAgICAgICAgICAgICAgIGlmKGNhcmRba2V5XSAhPT0gaXRlbSAmJiBjYXJkW2tleV0gIT09IG51bGwpeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdG9EZWxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkW3ZhbHVlXSA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVmVoaWNsZUNhcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZlaGljbGVDYXJkc0xpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLl9pZCwgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYnJhbmQ6ICBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiAgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBib2R5OiAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGhvcnNlcG93ZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbWlsYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhckxpY2Vuc2VQbGF0ZXM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgeWVhck9mUHJvZHVjdGlvbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlSGlzdG9yeTogW11cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52ZWhpY2xlQ2FyZHNMaXN0KVxyXG4gICAgICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlVmVoaWNsZUNhcmQgPSBmdW5jdGlvbihjYXJkSW5kZXgpe1xyXG4gICAgICAgICAgICBcdCRzY29wZS52ZWhpY2xlQ2FyZHNMaXN0LnNwbGljZShjYXJkSW5kZXgsIDEpXHJcbiAgICAgICAgICAgIH0gIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnllcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ1BPU1QnLCB1cmw6ICcvYXBpL3ZlaGljbGUtY2FyZCcsIGRhdGE6ICRzY29wZS52ZWhpY2xlQ2FyZHNMaXN0IH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0RvZGFubyBrYXJ0xJkgcG9qYXpkdScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1zdWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudmVoaWNsZUNhcmRzTGlzdCA9IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6ICRyb290U2NvcGUuY3VycmVudFVzZXIuX2lkLCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyYW5kOiAgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6ICAgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcnNlcG93ZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaWxhZ2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJMaWNlbnNlUGxhdGVzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhck9mUHJvZHVjdGlvbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VIaXN0b3J5OiBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XTsgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdXeXN0xIVwacWCIGLFgsSFZCBwb2RjemFzIGRvZGF3YW5pYSBrYXJ0eSBwb2phemR1JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2FsZXJ0LWRhbmdlcidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdCRzY29wZS5ubyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcyhmYWxzZSk7XHJcblx0XHRcdH07XHJcblxyXG4gICAgICAgIH1dXHJcblx0fVxyXG59IiwidmFyIHZlaGljbGVSZWdpc3Rlck1vZGFsID0gZnVuY3Rpb24oY2FyZExpc3Qpe1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvbW9kYWxzL3ZlaGljbGUtcmVnaXN0ZXItbW9kYWwuaHRtbCcsXHJcbiAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLCAgICAgICAgIFxyXG4gICAgICAgIHdpbmRvd0NsYXNzOiAncmVzcG9uc2l2ZS1zaXplJyxcclxuICAgICAgICBjb250cm9sbGVyOlsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHVpYk1vZGFsSW5zdGFuY2UnLCAnJGh0dHAnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJGh0dHApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtc1BlclBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAkc2NvcGUudmVoaWNsZUNhcmRzTGlzdCA9IGNhcmRMaXN0OyAgICAgICAgICAgIFxyXG5cclxuXHJcbiAgXHJcbiAgICAgICAgICAgICRzY29wZS55ZXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdCRzY29wZS5ubyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcyhmYWxzZSk7XHJcblx0XHRcdH07XHJcblxyXG4gICAgICAgIH1dXHJcblx0fVxyXG59IiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1yb290LWNvbnRyb2xsZXInKVxyXG5cclxuLmNvbmZpZyhbXCIkcm91dGVQcm92aWRlclwiLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAud2hlbignL21haW5QYWdlJ1x0XHQseyBjb250cm9sbGVyOiAnbWFpbi1wYWdlLWNvbnRyb2xsZXInLCAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6J21haW4tcGFnZS5odG1sJ30pICAgIFxyXG4gICAgLndoZW4oJy9jbGllbnRQYWdlJ1x0XHQseyBjb250cm9sbGVyOiAnY2xpZW50LXNlcnZpY2VzLXBhZ2UtY29udHJvbGxlcicsICAgdGVtcGxhdGVVcmw6J2NsaWVudC1zZXJ2aWNlcy1wYWdlLmh0bWwnfSkgICAgXHJcbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzonL21haW5QYWdlJ30pXHJcblxyXG59XSk7Il19
