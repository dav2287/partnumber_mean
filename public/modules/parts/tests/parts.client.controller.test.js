'use strict';

(function() {
	// Parts Controller Spec
	describe('Parts Controller Tests', function() {
		// Initialize global variables
		var PartsController,
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

			// Initialize the Parts controller.
			PartsController = $controller('PartsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Part object fetched from XHR', inject(function(Parts) {
			// Create sample Part using the Parts service
			var samplePart = new Parts({
				name: 'New Part'
			});

			// Create a sample Parts array that includes the new Part
			var sampleParts = [samplePart];

			// Set GET response
			$httpBackend.expectGET('parts').respond(sampleParts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parts).toEqualData(sampleParts);
		}));

		it('$scope.findOne() should create an array with one Part object fetched from XHR using a partId URL parameter', inject(function(Parts) {
			// Define a sample Part object
			var samplePart = new Parts({
				name: 'New Part'
			});

			// Set the URL parameter
			$stateParams.partId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/parts\/([0-9a-fA-F]{24})$/).respond(samplePart);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.part).toEqualData(samplePart);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Parts) {
			// Create a sample Part object
			var samplePartPostData = new Parts({
				name: 'New Part'
			});

			// Create a sample Part response
			var samplePartResponse = new Parts({
				_id: '525cf20451979dea2c000001',
				name: 'New Part'
			});

			// Fixture mock form input values
			scope.name = 'New Part';

			// Set POST response
			$httpBackend.expectPOST('parts', samplePartPostData).respond(samplePartResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Part was created
			expect($location.path()).toBe('/parts/' + samplePartResponse._id);
		}));

		it('$scope.update() should update a valid Part', inject(function(Parts) {
			// Define a sample Part put data
			var samplePartPutData = new Parts({
				_id: '525cf20451979dea2c000001',
				name: 'New Part'
			});

			// Mock Part in scope
			scope.part = samplePartPutData;

			// Set PUT response
			$httpBackend.expectPUT(/parts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/parts/' + samplePartPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid partId and remove the Part from the scope', inject(function(Parts) {
			// Create new Part object
			var samplePart = new Parts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Parts array and include the Part
			scope.parts = [samplePart];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/parts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePart);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.parts.length).toBe(0);
		}));
	});
}());