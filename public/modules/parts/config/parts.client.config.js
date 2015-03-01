'use strict';

// Configuring the Articles module
angular.module('parts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Parts', 'parts', 'dropdown', '/parts(/create)?');
		Menus.addSubMenuItem('topbar', 'parts', 'List Parts', 'parts');
		Menus.addSubMenuItem('topbar', 'parts', 'New Part', 'parts/create');
	}
]);