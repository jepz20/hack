'use strict';

// Proyectos controller
angular.module('proyectos').controller('ProyectosController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Proyectos',
	function($scope, $stateParams, $location, $http, Authentication, Proyectos) {
		$scope.authentication = Authentication;

		// Create new Proyecto
		$scope.create = function() {
			// Create new Proyecto object
			var beneficiarios = [];
			var imagenes = [];

			beneficiarios.push(this.beneficiarios);
			imagenes.push(this.imagenes);

			var proyecto = new Proyectos ({
				name: this.name,
				descripcion: this.descripcion,
				meses_estimados: this.meses_estimados,
				presupuesto: this.presupuesto,
				monto_requerido: this.monto_requerido,
				monto_contribuido: this.monto_contribuido,
				localizacion_texto: this.localizacion_texto,
				estado_actual: this.estado_actual,
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

		$scope.agregar = function () {
			var proyecto = $scope.proyecto;

			$http.post('/contribuyentes/agregarproyecto', {
				contribuyenteId: $scope.authentication.user.contribuyente, 
				proyectoId: proyecto._id
			}).then(function(res){
				$scope.respuestaAgregado = 'Guardado exitosamente';
			}, function(err){
				$scope.respuestaAgregado = 'No se pudo agregar el proyecto';
			});
		};

		/**
	     *Redirige a la pagina que muestra el procedimiento y los pasos
	     @param {string} url pagina a la que se ira
	     */
	    $scope.ir = function(url) {	    	
	    	console.log($scope.proyectos);
	    	console.log(url);
	        $location.path('/proyectos/' + $scope.proyectos[url]._id);
	    };		
	}
]);