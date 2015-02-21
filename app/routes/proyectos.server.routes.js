'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var proyectos = require('../../app/controllers/proyectos.server.controller');

	// Proyectos Routes
	app.route('/proyectos')
		.get(proyectos.list)
		.post(users.requiresLogin, proyectos.create);

	app.route('/proyectos/:proyectoId')
		.get(proyectos.read)
		.put(users.requiresLogin, proyectos.hasAuthorization, proyectos.update)
		.delete(users.requiresLogin, proyectos.hasAuthorization, proyectos.delete);

	// Finish by binding the Proyecto middleware
	app.param('proyectoId', proyectos.proyectoByID);
};
