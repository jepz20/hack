'use strict';

// Configuring the Articles module
angular.module('contribuyentes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Contribuyentes', 'contribuyentes', 'dropdown', '/contribuyentes(/create)?');
		// Menus.addSubMenuItem('topbar', 'contribuyentes', 'List Contribuyentes', 'contribuyentes');
		// Menus.addSubMenuItem('topbar', 'contribuyentes', 'New Contribuyente', 'contribuyentes/create');
	}
]);