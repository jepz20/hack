'use strict';

// Proyectos controller
angular.module('proyectos').controller('ProyectosController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Proyectos','CargarArchivo',
	'$window', function($scope, $stateParams, $location, $http, Authentication, Proyectos,CargarArchivo, $window) {
		$scope.authentication = Authentication;
		$scope.alerts = [];
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
			var icono_ext;
			var proyecto = $scope.proyecto;

			if ($scope.fileImagen)
			{
				icono_ext = $scope.fileImagen.name.substr($scope.fileImagen.name.length-3,3);
			}
			else {
				icono_ext = null;
			}
			$scope.proyecto.imagen = icono_ext || $scope.programa.icono;

			proyecto.$update(function(response) {
				if (icono_ext) {
					$scope.uploadIcono(response.imagen);
				}
				$scope.regresar();
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
			}, function() {				
				$scope.estadoCalculado = 'Activo';
				if ($scope.proyecto.monto_requerido <= $scope.proyecto.monto_contribuido ) {
					$scope.estadoCalculado = 'Concluido';
				}
			});
		};

		$scope.agregar = function () {
			var proyecto = $scope.proyecto;
			if ($scope.authentication.user) {
				if ($scope.authentication.user.contribuyente) {
					$http.post('/contribuyentes/agregarproyecto', {
						contribuyenteId: $scope.authentication.user.contribuyente, 
						proyectoId: proyecto._id
					}).then(function(res){
						console.log(res);
						$scope.respuestaAgregado = 'Guardado exitosamente';						
						console.log($scope.respuestaAgregado);
						$scope.proyecto.monto_contribuido = $scope.proyecto.monto_contribuido + res.data.total;
						$scope.addAlert('Muchas gracias por tu pago de impuesto a esta obra!!!','success');
					}, function(err){
						$scope.respuestaAgregado = err.data.message;
						$scope.addAlert('Lo sentimos ' + $scope.respuestaAgregado + ':(','danger');
						console.log($scope.respuestaAgregado);
					});
				} else {
					$location.path('/signin');
				}
			} else {
				$location.path('/signin');
			}
			
		};

	  $scope.addAlert = function(msg,type) {
	    $scope.alerts.push({msg: msg, type: type});
	  };

	  $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };

		/**
	     *Redirige a la pagina que muestra el procedimiento y los pasos
	     @param {string} url pagina a la que se ira
	     */
	    $scope.ir = function(url) {	
	        $location.path('/proyectos/' + $scope.proyectos[url]._id);
	    };	

	    // redirigir a actualizaciones
	    $scope.irActualizacion = function() {
	    	var url = '/proyectos/' + $scope.proyecto._id + '/actualizacion';
	    	$location.path(url);
	    };	
		
		$scope.uploadIcono = function(nombreIcono) {
	        var files = [];
	        var cont = 0;
	        if ($scope.fileImagen) {
	            files[cont] = $scope.fileImagen;
	            cont++;
	        }
			var uploadUrl = '/proyectos/uploadImagen?nombreIcono=' + nombreIcono;
	        CargarArchivo
	            .uploadFileToUrl(files, uploadUrl);
		};
        $scope.regresar = function() {
            $window.history.back();
        };

	    $scope.updateActualizacion = function() {
	    	var proyecto = $scope.proyecto;
	    	if ($scope.authentication.user) {
	    		$http.post('/proyectos/actualizacion', {	    			
	    			descripcion: this.descripcion,
	    			imagen: this.imagen,
	    			proyectoId: proyecto._id
	    		}).then(function(){
	    			$scope.respuestaAgregado = 'Guardado exitosamente';	
	    			$location.path('/proyectos/' + proyecto._id);    			
	    		}, function(err){
	    			$scope.respuestaAgregado = err.data.message;
	    		});
	    	} else {
	    		$location.path('/signin');
	    	}
	    };
	}
]);