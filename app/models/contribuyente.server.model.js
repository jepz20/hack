'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contribuyente Schema
 */
var ContribuyenteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Contribuyente name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	direccion:{
		Ciudad:{
			type: String,
			trim: true,
			required: 'favor ingrese su ciudad'
		},
		Barrio:{
			type: String,
			trim: true,
			required: 'favor ingrese el barrio en el que vive.'
		},
		bloque:{
			type: String,
			trim: true
		},
	},
	telefonos:
		[{
			type: String,
			trim: true,
			maxLength: 8
		}]
	,
	pagos: [{
		tipo_impuesto:{
			type: String,
			trim: true
		},
		valor_impuesto:{
			type: Number
		},
		anio: {
			type: Number	
		},
		fechaPago:{
			type: Date,
			default: Date.now
		},
		valorPago:{
			type: Number
		}


	}]

});

mongoose.model('Contribuyente', ContribuyenteSchema);