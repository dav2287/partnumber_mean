'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var parts = require('../../app/controllers/parts.server.controller');

	// Parts Routes
	app.route('/parts')
		.get(parts.list)
		.post(users.requiresLogin, parts.create);

	app.route('/parts/:partId')
		.get(parts.read)
		.put(users.requiresLogin, parts.hasAuthorization, parts.update)
		.delete(users.requiresLogin, parts.hasAuthorization, parts.delete);

	// Finish by binding the Part middleware
	app.param('partId', parts.partByID);
};
