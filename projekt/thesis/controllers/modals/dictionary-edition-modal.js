var dictionaryEditionModal = function(allCategories){
	return {
		templateUrl: '/templates/modals/dictionary-edition-modal.html',
        backdrop: 'static',         
        windowClass: 'responsive-size',
        controller:['$scope', '$uibModalInstance', '$http', function ($scope, $uibModalInstance, $http) {
                      
            console.log(allCategories)
            $scope.servicesDict = allCategories;
            $scope.allCategories = allCategories.entries;
            $scope.mainCategoryKey = null;
            $scope.subCategoryDict = null;
            $scope.serviceInEdit = null;
            $scope.createCategory = false;
            $scope.newCategory = null;           
            

            $scope.getCategoryServices = function(key){
                $http({ method: 'GET', url: '/api/dictionaries/' + key + '/Services' })
                .then(function success(response){                                  
                    $scope.subCategoryDict = response.data[0]
                    $scope.subCategoryDict.entries.forEach(function(entry, index){
                        entry.tempIndex = index
                    })
                    $scope.serviceInEdit = null
                })
            }

            $scope.addNewEntry = function(){
                $scope.serviceInEdit = {
                    key: null,
                    parentKey: null,
                    description: null,
                    param: null,
                    param2: null,
                }
            }

            $scope.addNewCategory = function(){
                $scope.serviceInEdit = null
                $scope.createCategory = true

                $scope.newCategory = {
                    key: null,
                    parentKey: "Services",
                    entries: []
                }
            }

            $scope.editEntry = function(service){
                console.log(service)
                $scope.serviceInEdit = service
            }

            $scope.removeEntry = function(service){
                var index = $scope.subCategoryDict.entries.indexOf(service)
                $scope.subCategoryDict.entries.splice(index, 1)
            }

            $scope.closeEditMode = function(){
                $scope.serviceInEdit = null
            }

            $scope.yes = function(){                
                if($scope.serviceInEdit){
                    if($scope.serviceInEdit.tempIndex){
                        $scope.subCategoryDict.entries[$scope.serviceInEdit.tempIndex] = $scope.serviceInEdit
                        $scope.subCategoryDict.entries.forEach(function(service){
                            delete service.tempIndex
                        })
                    }else{
                        $scope.subCategoryDict.entries.push($scope.serviceInEdit)
                    }
                }                

                if($scope.createCategory){
                    console.log($scope.newCategory)
                    $scope.servicesDict.entries.push({
                        key: $scope.newCategory.key
                    })
                    delete $scope.servicesDict.__v
                    

                    $http({ method: 'PATCH', url: '/api/dictionaries/Services', data: $scope.servicesDict})
                    .then(function success(response){                    
                        return $http({ method: 'POST', url: '/api/dictionaries/' + $scope.newCategory.key + '/Services', data: $scope.newCategory })
                    })
                    .then(function success(response){   
                        return $http({ method: 'GET', url: '/api/dictionaries/Services' })
                    })
                    .then(function success(response){
                        $scope.servicesDict = response.data
                        $scope.allCategories = $scope.servicesDict.entries
                        $scope.createCategory = false
                    })     
                }else{
                    $http({ method: 'PATCH', url: '/api/dictionaries/' + $scope.subCategoryDict.key + '/Services', data: $scope.subCategoryDict})
                    .then(function success(response){                    
                        return $http({ method: 'GET', url: '/api/dictionaries/' + $scope.subCategoryDict.key + '/Services' })                    
                    })
                    .then(function success(response){   
                            $scope.subCategoryDict = response.data[0]
                            $scope.mainCategoryKey.key = $scope.subCategoryDict.key
                    })        
                }
            }

			$scope.no = function(){
				$uibModalInstance.dismiss(false);
			};

        }]
	}
}