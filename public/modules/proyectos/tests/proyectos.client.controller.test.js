'use strict';

(function() {
	// Proyectos Controller Spec
	describe('Proyectos Controller Tests', function() {
		// Initialize global variables
		var ProyectosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Proyectos controller.
			ProyectosController = $controller('ProyectosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Proyecto object fetched from XHR', inject(function(Proyectos) {
			// Create sample Proyecto using the Proyectos service
			var sampleProyecto = new Proyectos({
				name: 'New Proyecto'
			});

			// Create a sample Proyectos array that includes the new Proyecto
			var sampleProyectos = [sampleProyecto];

			// Set GET response
			$httpBackend.expectGET('proyectos').respond(sampleProyectos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proyectos).toEqualData(sampleProyectos);
		}));

		it('$scope.findOne() should create an array with one Proyecto object fetched from XHR using a proyectoId URL parameter', inject(function(Proyectos) {
			// Define a sample Proyecto object
			var sampleProyecto = new Proyectos({
				name: 'New Proyecto'
			});

			// Set the URL parameter
			$stateParams.proyectoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/proyectos\/([0-9a-fA-F]{24})$/).respond(sampleProyecto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proyecto).toEqualData(sampleProyecto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Proyectos) {
			// Create a sample Proyecto object
			var sampleProyectoPostData = new Proyectos({
				name: 'New Proyecto'
			});

			// Create a sample Proyecto response
			var sampleProyectoResponse = new Proyectos({
				_id: '525cf20451979dea2c000001',
				name: 'New Proyecto'
			});

			// Fixture mock form input values
			scope.name = 'New Proyecto';

			// Set POST response
			$httpBackend.expectPOST('proyectos', sampleProyectoPostData).respond(sampleProyectoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Proyecto was created
			expect($location.path()).toBe('/proyectos/' + sampleProyectoResponse._id);
		}));

		it('$scope.update() should update a valid Proyecto', inject(function(Proyectos) {
			// Define a sample Proyecto put data
			var sampleProyectoPutData = new Proyectos({
				_id: '525cf20451979dea2c000001',
				name: 'New Proyecto'
			});

			// Mock Proyecto in scope
			scope.proyecto = sampleProyectoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/proyectos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/proyectos/' + sampleProyectoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid proyectoId and remove the Proyecto from the scope', inject(function(Proyectos) {
			// Create new Proyecto object
			var sampleProyecto = new Proyectos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Proyectos array and include the Proyecto
			scope.proyectos = [sampleProyecto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/proyectos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProyecto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.proyectos.length).toBe(0);
		}));
	});
}());