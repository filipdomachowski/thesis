angular.module('app-root-controller')

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
    .when('/mainPage'		,{ controller: 'main-page-controller',              templateUrl:'main-page.html'})    
    .when('/clientPage'		,{ controller: 'client-services-page-controller',   templateUrl:'client-services-page.html'})    
    .when('/servicePage'	,{ controller: 'service-page-controller',           templateUrl:'service-page.html'})  
    .otherwise({ redirectTo:'/mainPage'})

}]);