angular.module('iguana.next', [
  'pascalprecht.translate',
  'templates-app',
  'templates-common',
  'ui.router',
  'ui.bootstrap',
  'ui.keypress',
  'iguana.core.menu'
])

.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function cobAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider) {
  
  //$urlRouterProvider.otherwise( '/path' );

  $stateProvider.state('error', {
      url: '/error',
      views: {
          "main": {
              templateUrl: 'error.tpl.html'
          }
      }
  })
  .state( 'application', {
      abstract: true,
      views: {
          "application": {
              templateUrl: 'application.tpl.html'
          }
      }
  });
  
}])


.run(["$rootScope", "$log", "$location", "$state", function run ( $rootScope, $log, $location, $state) {
    $log.info('Run main application');
}])

.controller( 'mainAppCtrl', ['$scope', '$location', function mainAppCtrl ( $scope, $location ) {
}])

;
