'use strict';

//Setting up route
angular.module('contribuyentes').config(['$stateProvider',
	function($stateProvider) {
		// Contribuyentes state routing
		$stateProvider.
		state('listContribuyentes', {
			url: '/contribuyentes',
			templateUrl: 'modules/contribuyentes/views/list-contribuyentes.client.view.html'
		}).
		state('createContribuyente', {
			url: '/contribuyentes/create',
			templateUrl: 'modules/contribuyentes/views/create-contribuyente.client.view.html'
		}).
		state('viewContribuyente', {
			url: '/contribuyentes/:contribuyenteId',
			templateUrl: 'modules/contribuyentes/views/view-contribuyente.client.view.html'
		}).
		state('editContribuyente', {
			url: '/contribuyentes/:contribuyenteId/edit',
			templateUrl: 'modules/contribuyentes/views/edit-contribuyente.client.view.html'
		});
	}
]);