'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Part Schema
 */
var PartSchema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please fill Part description',
		trim: true
	},

	category: {
		type: String,
		required: 'Please fill Part category'
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

mongoose.model('Part', PartSchema);