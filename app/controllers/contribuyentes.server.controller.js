'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contribuyente = mongoose.model('Contribuyente'),
	_ = require('lodash');

/**
 * Create a Contribuyente
 */
exports.create = function(req, res) {
	var contribuyente = new Contribuyente(req.body);
	contribuyente.user = req.user;

	contribuyente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contribuyente);
		}
	});
};

/**
 * Show the current Contribuyente
 */
exports.read = function(req, res) {
	res.jsonp(req.contribuyente);
};

/**
 * Update a Contribuyente
 */
exports.update = function(req, res) {
	var contribuyente = req.contribuyente ;

	contribuyente = _.extend(contribuyente , req.body);

	contribuyente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contribuyente);
		}
	});
};

/**
 * Delete an Contribuyente
 */
exports.delete = function(req, res) {
	var contribuyente = req.contribuyente ;

	contribuyente.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contribuyente);
		}
	});
};

/**
 * List of Contribuyentes
 */
exports.list = function(req, res) { 
	Contribuyente.find().sort('-created').populate('user', 'displayName').exec(function(err, contribuyentes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contribuyentes);
		}
	});
};

/**
 * Contribuyente middleware
 */
exports.contribuyenteByID = function(req, res, next, id) { 
	Contribuyente.findById(id).populate('user', 'displayName')..populate(proyectos).exec(function(err, contribuyente) {
		if (err) return next(err);
		if (! contribuyente) return next(new Error('Failed to load Contribuyente ' + id));
		req.contribuyente = contribuyente ;
		next();
	});
};

/**
 * Contribuyente authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contribuyente.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
