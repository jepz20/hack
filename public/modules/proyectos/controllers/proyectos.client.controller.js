'use strict';

// Proyectos controller
angular.module('proyectos').controller('ProyectosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proyectos',
	function($scope, $stateParams, $location, Authentication, Proyectos) {
		$scope.authentication = Authentication;

		// Create new Proyecto
		$scope.create = function() {
			// Create new Proyecto object
			var proyecto = new Proyectos ({
				name: this.name
			});

			// Redirect after save
			proyecto.$save(function(response) {
				$location.path('proyectos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proyecto
		$scope.remove = function(proyecto) {
			if ( proyecto ) { 
				proyecto.$remove();

				for (var i in $scope.proyectos) {
					if ($scope.proyectos [i] === proyecto) {
						$scope.proyectos.splice(i, 1);
					}
				}
			} else {
				$scope.proyecto.$remove(function() {
					$location.path('proyectos');
				});
			}
		};

		// Update existing Proyecto
		$scope.update = function() {
			var proyecto = $scope.proyecto;

			proyecto.$update(function() {
				$location.path('proyectos/' + proyecto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proyectos
		$scope.find = function() {
			$scope.proyectos = Proyectos.query();
		};

		// Find existing Proyecto
		$scope.findOne = function() {
			$scope.proyecto = Proyectos.get({ 
				proyectoId: $stateParams.proyectoId
			});
		};
	}
]);