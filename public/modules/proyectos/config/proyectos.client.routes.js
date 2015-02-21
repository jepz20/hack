'use strict';

//Setting up route
angular.module('proyectos').config(['$stateProvider',
	function($stateProvider) {
		// Proyectos state routing
		$stateProvider.
		state('listProyectos', {
			url: '/proyectos',
			templateUrl: 'modules/proyectos/views/list-proyectos.client.view.html'
		}).
		state('createProyecto', {
			url: '/proyectos/create',
			templateUrl: 'modules/proyectos/views/create-proyecto.client.view.html'
		}).
		state('viewProyecto', {
			url: '/proyectos/:proyectoId',
			templateUrl: 'modules/proyectos/views/view-proyecto.client.view.html'
		}).
		state('editProyecto', {
			url: '/proyectos/:proyectoId/edit',
			templateUrl: 'modules/proyectos/views/edit-proyecto.client.view.html'
		});
	}
]);