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