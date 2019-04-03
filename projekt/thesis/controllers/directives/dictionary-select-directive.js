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