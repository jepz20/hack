'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proyecto = mongoose.model('Proyecto'),
	fs = require('fs'),
    path = require('path'),
    Busboy = require('busboy'),
    os = require('os'),
    inspect = require('util').inspect,
	_ = require('lodash');

/**
 * Create a Proyecto
 */
exports.create = function(req, res) {
	var proyecto = new Proyecto(req.body);
	proyecto.user = req.user;

	proyecto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

/**
 * Show the current Proyecto
 */
exports.read = function(req, res) {
	res.jsonp(req.proyecto);
};

/**
 * Update a Proyecto
 */
exports.update = function(req, res) {
	var proyecto = req.proyecto ;

	proyecto = _.extend(proyecto , req.body);

	proyecto.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

/**
 * Delete an Proyecto
 */
exports.delete = function(req, res) {
	var proyecto = req.proyecto ;

	proyecto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

/**
 * List of Proyectos
 */
exports.list = function(req, res) { 
    var sort = {}; //campo para hacer el sort, en caso de vacio por fecha de creacion
    var limite = 99999; //cuantos datos devolvera
    var query = {}; //El query por el que se filtrara
    var nombreConsulta;
    var campos = {};
   //busca si envio parametro para sort
    if (req.query.sort) {
        if (req.query.tipoSort) {
            sort[req.query.sort] = req.query.tipoSort;
        } else {
            sort[req.query.sort] = 1;
        }
    } else {
        sort.created = -1;
    }

    //determina si envio limite de envio
    if (req.query.limite) {
        limite= req.query.limite;
    }

    //El query

    if (req.query.name) {
        query.name = {};
        query.name.$regex = new RegExp(req.query.name,'gi');
        campos = {};
    }

        //determina si se envio un query
    if (req.query.campoQ && req.query.valorQ) {
        //si quisieran mandar un 1 = 1 que no agregue los campos
        if (req.query.campoQ.toString() !== req.query.valorQ.toString()) {
            if (req.query.valorQ instanceof Array) {

                query[req.query.campoQ] = {};
                query[req.query.campoQ].$in = [];
                query[req.query.campoQ].$in = req.query.valorQ;

            } else {
                query[req.query.campoQ] = req.query.valorQ;
            }
        }
    }	
	Proyecto.find(query,campos).
	sort('-created')
	.limit(limite)
	.populate('user', 'displayName')
	.exec(function(err, proyectos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyectos);
		}
	});
};

/**
 * Proyecto middleware
 */
exports.proyectoByID = function(req, res, next, id) { 
	Proyecto.findById(id).populate('user', 'displayName').exec(function(err, proyecto) {
		if (err) return next(err);
		if (! proyecto) return next(new Error('Failed to load Proyecto ' + id));
		req.proyecto = proyecto ;
		next();
	});
};

/**
 * Proyecto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proyecto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};



/**
 *Carga la imagen y video del procedimiento ademas de hacer
 *un thumbnail de la imagen
 */
exports.agregarImagenes= function (req, res) {
    var proyectosId = req.query.proyectosId;
    var newImagenName;
    if (req.files){
        if (req.files.length > 0) {
            var rootPath = path.normalize(__dirname + '/../..');
            rootPath = rootPath + '/public/modules/proyectoss/img/';
            /*Guarda la imagen*/
            if (req.files.image) {
                if (req.files.image.size !== 0) {
                    var imagen = req.files.image;
                    var imagenName = imagen.name;
                    newImagenName = proyectosId ;
                    var newPathImagen = rootPath + newImagenName;
                    console.log(newPathImagen);
                    fs.readFile(imagen.path, function (err, data) {
                        /// If there's an error
                        if(!imagenName){
                            console.log('There was an error');
                            res.send('Nose se guardo la imagen');
                        } else {
                            /// write file to uploads/fullsize folder
                            fs.writeFile(newPathImagen, data);
                        }
                    });
                } else {
                    newImagenName = '';
                }
            } else {
                console.log('no venian imagenes');
            }

            var responseObj = {
                imagenUrl: newImagenName
            };
            res.send(JSON.stringify(responseObj));
        } else {
            console.log('no venia nada');
        }
    }
    else {
        console.log('no hay nada');
        res.send({ msg: 'No existia el archivo ' + new Date().toString() });
    }
};
