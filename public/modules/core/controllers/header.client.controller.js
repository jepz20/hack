'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location',
	function($scope, Authentication, Menus, $http,$location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		    /**
     *Busca proyectos por el nombre
     *@param {string} val nombre del proyecto
      *@return {object} proyecto con el nombre y la descripcion
     */
    $scope.buscaProyectos = function(val) {
    	console.log('val');
    	console.log(val);
        return $http.get('proyectos/', {
            params: {
                name: val
            }
        }).then(function(res){        	 
            var proyectos = [];
            angular.forEach(res.data, function(item){
                proyectos.push(item);
            });            
            return proyectos;
        });
    };
    /**
     *funciones luego que se selecciona un proyecto en la busqueda
     *@param {object} $item objeto que contiene la respuesta del typeahead
     */
    $scope.seleccionarProyecto = function($item) {
        console.log('$item');
        console.log($item);
        $location.path('/proyectos/' + $item._id);
    };

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
    
]);