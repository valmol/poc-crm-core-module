/**
 * Iguana.Next.Core - v1.0.0 - 2014-06-26
 * http://astelit.com.ua
 *
 * Copyright (c) 2014 Astelit
 * Licensed  <>
 */
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
;angular.module('iguana.core.menu', [])
  .directive('menu', ['$location','$rootScope', '$log', menuFunc]);
function menuFunc($location, $rootScope, $log) {
    return {
        restrict: 'E',
        templateUrl: 'components/menu/views/menu.tpl.html',
        scope: {

        },
        link: function (scope, element, attrs) {
            scope.isActive = function(route) {
                return route === $location.path();
            };
            scope.modules = [
			{name: 'Customer', url: '/customers'}
		];
        }
    };
}

;angular.module('templates-app', []);

;angular.module('templates-common', ['application.tpl.html', 'menu/views/menu.tpl.html']);

angular.module("application.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("application.tpl.html",
    "<div class=\"app-body\">\n" +
    "  <div ui-view=\"header\"></div>\n" +
    "  \n" +
    "  <div class=\"container\">\n" +
    "      <div ui-view=\"caption\"></div>\n" +
    "      <div class=\"rdsa-body\">\n" +
    "          <div class=\"rdsa-menu-box\">\n" +
    "              <div ui-view=\"side\"></div>\n" +
    "          </div>\n" +
    "          <div class=\"rdsa-main\">\n" +
    "              <div ui-view=\"main\">\n" +
    "                  <div class=\"app-busy\"></div>\n" +
    "              </div>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view=\"footer\"></div>\n" +
    "");
}]);

angular.module("menu/views/menu.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menu/views/menu.tpl.html",
    "<ul class=\"nav nav-pills pull-right\" data-ng-repeat=\"module in modules\">\n" +
    "    <li><a ng-href=\"#{{module.url}}\">{{module.name}}</a></li>\n" +
    "</ul>");
}]);
