'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Part = mongoose.model('Part'),
	_ = require('lodash');

/**
 * Create a Part
 */
exports.create = function(req, res) {
	var part = new Part(req.body);
	part.user = req.user;

	// Smart number assignation logic
	switch(part.category) {
		case "custom":
			part.part_number = 900;
			break;
		case "assembly":
			part.part_number = 600;
			break;
		case "fastener":
			part.part_number = 400;
			break;
		default:
			part.part_number = 100;
			break;
	}

	part.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(part);
		}
	});
};

/**
 * Show the current Part
 */
exports.read = function(req, res) {
	res.jsonp(req.part);
};

/**
 * Update a Part
 */
exports.update = function(req, res) {
	var part = req.part ;

	part = _.extend(part , req.body);

	part.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(part);
		}
	});
};

/**
 * Delete an Part
 */
exports.delete = function(req, res) {
	var part = req.part ;

	part.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(part);
		}
	});
};

/**
 * List of Parts
 */
exports.list = function(req, res) { 
	Part.find().sort('-created').populate('user', 'displayName').exec(function(err, parts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parts);
		}
	});
};

/**
 * Part middleware
 */
exports.partByID = function(req, res, next, id) { 
	Part.findById(id).populate('user', 'displayName').exec(function(err, part) {
		if (err) return next(err);
		if (! part) return next(new Error('Failed to load Part ' + id));
		req.part = part ;
		next();
	});
};

/**
 * Part authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.part.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
