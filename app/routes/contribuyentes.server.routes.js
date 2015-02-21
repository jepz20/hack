'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var contribuyentes = require('../../app/controllers/contribuyentes.server.controller');

	// Contribuyentes Routes
	app.route('/contribuyentes')
		.get(contribuyentes.list)
		.post(users.requiresLogin, contribuyentes.create);

	app.route('/contribuyentes/:contribuyenteId')
		.get(contribuyentes.read)
		.put(users.requiresLogin, contribuyentes.hasAuthorization, contribuyentes.update)
		.delete(users.requiresLogin, contribuyentes.hasAuthorization, contribuyentes.delete);

	// Finish by binding the Contribuyente middleware
	app.param('contribuyenteId', contribuyentes.contribuyenteByID);
};
