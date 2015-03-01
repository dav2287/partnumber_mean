'use strict';

//Parts service used to communicate Parts REST endpoints
angular.module('parts').factory('Parts', ['$resource',
	function($resource) {
		return $resource('parts/:partId', { partId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);