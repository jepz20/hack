'use strict';

//Proyectos service used to communicate Proyectos REST endpoints
angular.module('proyectos').factory('Proyectos', ['$resource',
	function($resource) {
		return $resource('proyectos/:proyectoId', { proyectoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);