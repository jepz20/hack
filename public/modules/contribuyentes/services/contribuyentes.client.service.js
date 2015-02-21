'use strict';

//Contribuyentes service used to communicate Contribuyentes REST endpoints
angular.module('contribuyentes').factory('Contribuyentes', ['$resource',
	function($resource) {
		return $resource('contribuyentes/:contribuyenteId', { contribuyenteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);