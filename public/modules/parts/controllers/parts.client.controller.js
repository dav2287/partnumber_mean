'use strict';

// Parts controller
angular.module('parts').controller('PartsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parts',
	function($scope, $stateParams, $location, Authentication, Parts) {
		$scope.authentication = Authentication;

		// Create new Part
		$scope.create = function() {
			// Create new Part object
			var part = new Parts ({
				name: this.name
			});

			// Redirect after save
			part.$save(function(response) {
				$location.path('parts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Part
		$scope.remove = function(part) {
			if ( part ) { 
				part.$remove();

				for (var i in $scope.parts) {
					if ($scope.parts [i] === part) {
						$scope.parts.splice(i, 1);
					}
				}
			} else {
				$scope.part.$remove(function() {
					$location.path('parts');
				});
			}
		};

		// Update existing Part
		$scope.update = function() {
			var part = $scope.part;

			part.$update(function() {
				$location.path('parts/' + part._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Parts
		$scope.find = function() {
			$scope.parts = Parts.query();
		};

		// Find existing Part
		$scope.findOne = function() {
			$scope.part = Parts.get({ 
				partId: $stateParams.partId
			});
		};
	}
]);