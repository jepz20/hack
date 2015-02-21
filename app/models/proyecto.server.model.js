'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Proyecto Schema
 */
var ProyectoSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Por favor llenar el nombre del proyecto',
		trim: true
	},
	descripcion: {
		type: String,
		default: '',
		required: 'Favor llenar la descripcion del proyecto',
		trim: true
	},
	beneficiados: [{
		type: String,
		default: '',
		required: 'Favor llenar los beneficiados del proyecto',
		trim:  true
	}],
	fecha_inicio: {
		type: Date,
		required: 'Favor llenar la fecha de inicio del proyecto'
	},
	meses_estimados: {
		type: Number,
		default: 0,
		required: 'Favor llenar los meses estimados para el proyecto'
	},
	presupuesto: {
		type: Number,
		default: 0,
		required: 'Favor llenar el proyectoresupuesto del proyecto'
	},
	localizacion_texto: {
		type: String,
		default: '',
		required: 'Favor llenar la localizacion del proyecto'
	},
	estado_actual: {
		type: String,
		default: ''
	},
	actualizaciones: [{
		fecha_actualizacion: {
			type: Date,
			default: Date.now
		},
		descripcion_actualizacion: {
			type: String,
			default: '',
			required: 'Favor llenar descripcion de actualizacion',
			trim: true
		},
		imagenes_actualizacion: {
			type: String,
			trim: true
		}
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Proyecto', ProyectoSchema);