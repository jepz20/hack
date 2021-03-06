'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contribuyente = mongoose.model('Contribuyente'),
	_ = require('lodash');
var Proyecto = mongoose.model('Proyecto');

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
	Contribuyente.find().sort('-created').populate('user', 'displayName').populate('proyectos_contribuidos').exec(function(err, contribuyentes) {
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
	Contribuyente.findById(id).populate('user', 'displayName').populate('proyectos_contribuidos').exec(function(err, contribuyente) {
		if (err) return next(err);
		if (! contribuyente) return next(new Error('Falla en la carga de Contribuyente ' + id));
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

/**
 * Agregar un proyecto 
 */
exports.agregarProyecto = function(req, res) {
	console.log('CONTRIBUYENTE: ' + req.body.contribuyenteId);
	console.log('PROYECTO: ' + req.body.proyectoId);

	Contribuyente.findById(req.body.contribuyenteId, function(err, contribuyente) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (! Contribuyente) {
				res.status(400).send({
					message: 'Fallo en la carga del contribuyente'
				});
			} else {	
				if (contribuyente.proyectos_contribuidos.indexOf(req.body.proyectoId) >= 0) {
					res.status(400).send({
						message: 'Proyecto ya ha sido elegido anteriormente'
					});
				} else {
					var totalPago = 0;
					contribuyente.proyectos_contribuidos.push(req.body.proyectoId);
					for (var i = contribuyente.pagos.length - 1; i >= 0; i--) {
						totalPago = contribuyente.pagos[i].valor_impuesto + totalPago;
					}

					contribuyente.pagos = [];
					if (totalPago !== 0) {
						contribuyente.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								Proyecto.findOne({_id: req.body.proyectoId}, function(err, proyecto) {
									proyecto.monto_contribuido = proyecto.monto_contribuido + totalPago * 0.4;
									proyecto.contribuyentes.push(req.body.contribuyenteId);
									proyecto.save(function() {
										res.jsonp({'Success': 'true', total: totalPago });
									});	
								});
							}
						});
					}
					else {
						res.status(400).send({
							message: 'No hay fondos suficientes'
						});
					}
				}
			}
		}
	});
};