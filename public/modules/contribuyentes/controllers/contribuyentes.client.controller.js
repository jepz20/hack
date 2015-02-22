'use strict';

// Contribuyentes controller
angular.module('contribuyentes').controller('ContribuyentesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contribuyentes',
	function($scope, $stateParams, $location, Authentication, Contribuyentes) {
		$scope.authentication = Authentication;


		// Create new Contribuyente
		$scope.create = function() {
			// Create new Contribuyente object
			var contribuyente = new Contribuyentes ({
				name: this.name,
				direccion: this.direccion	
			});

			// Redirect after save
			contribuyente.$save(function(response) {
				$location.path('contribuyentes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contribuyente
		$scope.remove = function(contribuyente) {
			if ( contribuyente ) { 
				contribuyente.$remove();

				for (var i in $scope.contribuyentes) {
					if ($scope.contribuyentes [i] === contribuyente) {
						$scope.contribuyentes.splice(i, 1);
					}
				}
			} else {
				$scope.contribuyente.$remove(function() {
					$location.path('contribuyentes');
				});
			}
		};

		// Update existing Contribuyente
		$scope.update = function() {
			var contribuyente = $scope.contribuyente;

			contribuyente.$update(function() {
				$location.path('contribuyentes/' + contribuyente._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contribuyentes
		$scope.find = function() {
			$scope.contribuyentes = Contribuyentes.query();
		};

		// Find existing Contribuyente
		$scope.findOne = function() {
			$scope.contribuyente = Contribuyentes.get({ 
				contribuyenteId: $stateParams.contribuyenteId				
			});			
			// $scope.pagos = [];
			// $scope.pagos[0] = {'tipo': 'Vecinal', 'anio': 2015, 'valor': 2000};
			// $scope.pagos[1] = {'tipo': 'Vecinal', 'anio': 2014, 'valor': 3000};
		};
	}
]);