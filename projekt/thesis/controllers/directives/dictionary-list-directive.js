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