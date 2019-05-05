const snInformationNote = function(){
    return {
        restrict: 'AE',
		templateUrl: '/templates/directives/information-note.html',		
		scope: {		
			snNoteObj: '=',
			snIndex: '<'			
		},
		controller:['$scope', '$rootScope', '$http', 'toast',
			function($scope, $rootScope, $http, toast) {
				
				$scope.index = $scope.snIndex
				$scope.deleted = false
				$scope.noteObj = $scope.snNoteObj
				$scope.noteObj.date = moment($scope.noteObj.date).format('YYYY-MM-DD HH:mm')
				
				$scope.removeNote = function(){
					$http({ method: 'DELETE', url: '/api/text-notes/' + $scope.noteObj._id })
						.then(function success(response){
							$scope.deleted = true
							$scope.$emit('notification', `Usunięto notkę informacyjną`, "alert-success")
						})
				}

				$scope.previewNote = function(){
					$scope.preview = !$scope.preview
				}

				$scope.saveNote = function(){					
					$scope.noteObj.headerStyle[`height`] = $scope.getHeaderHeight() + 2 + 'px'
					$scope.noteObj.textStyle[`height`] = $scope.getTextHeight() + 2 + 'px'

					if($scope.noteObj._id){
						$http({ method: 'PATCH', url: '/api/text-notes', data: $scope.noteObj })
							.then(function success(response){
								$scope.$emit('notification', `Zedytowano notkę informacyjną`, "alert-success")
							})
					}else{
						$http({ method: 'POST', url: '/api/text-notes', data: $scope.noteObj })
							.then(function success(response){
								$scope.noteObj._id = response.data._id
								$scope.$emit('notification', `Dodano notkę informacyjną`, "alert-success")
							})
					}
				}

				$scope.alignLeft = function(part){
					if(part === 'header'){
						$scope.noteObj.headerStyle[`text-align`] = "left"						
					}else{
						$scope.noteObj.textStyle[`text-align`] = "left"						
					}
				}

				$scope.alignCenter = function(part){
					if(part === 'header'){
						$scope.noteObj.headerStyle[`text-align`] = "center"						
					}else{
						$scope.noteObj.textStyle[`text-align`] = "center"						
					}
				}

				$scope.alignRight = function(part){
					if(part === 'header'){
						$scope.noteObj.headerStyle[`text-align`] = "right"						
					}else{
						$scope.noteObj.textStyle[`text-align`] = "right"						
					}
				}

				$scope.sizePlus = function(part){
					if(part === 'header'){
						$scope.noteObj.headerStyle[`font-size`] = parseFloat($scope.noteObj.headerStyle[`font-size`]) + 2 + 'px'
					}else{
						$scope.noteObj.textStyle[`font-size`] = parseFloat($scope.noteObj.textStyle[`font-size`]) + 2 + 'px'						
					}
				}

				$scope.sizeMinus = function(part){
					if(part === 'header'){
						$scope.noteObj.headerStyle[`font-size`] = parseFloat($scope.noteObj.headerStyle[`font-size`]) - 2 + 'px'
					}else{
						$scope.noteObj.textStyle[`font-size`] = parseFloat($scope.noteObj.textStyle[`font-size`]) - 2 + 'px'						
					}
				}

				$scope.getHeaderHeight = function(){
					var header = angular.element( document.querySelector( '#header-area' + $scope.index))
					return header[0].clientHeight
				}

				$scope.getTextHeight = function(){
					var text = angular.element( document.querySelector( '#text-area' + $scope.index ))
					return text[0].clientHeight
				}

				$scope.headerStyleFn = function(){
					return $scope.noteObj.headerStyle
				}

				$scope.textStyleFn = function(){
					return $scope.noteObj.textStyle
				}				

			}
		]
    }
}