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
	}
});

mongoose.model('Contribuyente', ContribuyenteSchema);