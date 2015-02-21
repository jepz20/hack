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
		ciudad:{
			type: String,
			trim: true,
			required: 'favor ingrese su ciudad'
		},
		barrio:{
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
	rtn:{
		type: String,
		trim: true
	},
	pagos: [{
		tipo_impuesto:{
			type: String,
			trim: true,
			required: 'favor ingrese el tipo de impuesto'
		},
		valor_impuesto:{
			type: Number,
			required: 'favor ingrese el valor de impuesto'
		},
		anio: {
			type: Number,
			required: 'favor ingrese el año'	
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