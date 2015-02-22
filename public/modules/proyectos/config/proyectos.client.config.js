'use strict';

// Configuring the Articles module
angular.module('proyectos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('topbar', 'Proyectos', 'proyectos', 'dropdown', '/proyectos(/create)?');
		Menus.addSubMenuItem('topbar', 'proyectos', 'List Proyectos', 'proyectos');
		Menus.addSubMenuItem('topbar', 'proyectos', 'New Proyecto', 'proyectos/create');*/
	}
]);