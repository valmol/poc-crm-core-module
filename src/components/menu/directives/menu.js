angular.module('iguana.core.menu', [])
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

