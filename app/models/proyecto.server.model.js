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
	name: {
		type: String,
		default: '',
		required: 'Please fill Proyecto name',
		trim: true
	},
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