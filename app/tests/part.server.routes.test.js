'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Part = mongoose.model('Part'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, part;

/**
 * Part routes tests
 */
describe('Part CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Part
		user.save(function() {
			part = {
				name: 'Part Name'
			};

			done();
		});
	});

	it('should be able to save Part instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Part
				agent.post('/parts')
					.send(part)
					.expect(200)
					.end(function(partSaveErr, partSaveRes) {
						// Handle Part save error
						if (partSaveErr) done(partSaveErr);

						// Get a list of Parts
						agent.get('/parts')
							.end(function(partsGetErr, partsGetRes) {
								// Handle Part save error
								if (partsGetErr) done(partsGetErr);

								// Get Parts list
								var parts = partsGetRes.body;

								// Set assertions
								(parts[0].user._id).should.equal(userId);
								(parts[0].name).should.match('Part Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Part instance if not logged in', function(done) {
		agent.post('/parts')
			.send(part)
			.expect(401)
			.end(function(partSaveErr, partSaveRes) {
				// Call the assertion callback
				done(partSaveErr);
			});
	});

	it('should not be able to save Part instance if no name is provided', function(done) {
		// Invalidate name field
		part.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Part
				agent.post('/parts')
					.send(part)
					.expect(400)
					.end(function(partSaveErr, partSaveRes) {
						// Set message assertion
						(partSaveRes.body.message).should.match('Please fill Part name');
						
						// Handle Part save error
						done(partSaveErr);
					});
			});
	});

	it('should be able to update Part instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Part
				agent.post('/parts')
					.send(part)
					.expect(200)
					.end(function(partSaveErr, partSaveRes) {
						// Handle Part save error
						if (partSaveErr) done(partSaveErr);

						// Update Part name
						part.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Part
						agent.put('/parts/' + partSaveRes.body._id)
							.send(part)
							.expect(200)
							.end(function(partUpdateErr, partUpdateRes) {
								// Handle Part update error
								if (partUpdateErr) done(partUpdateErr);

								// Set assertions
								(partUpdateRes.body._id).should.equal(partSaveRes.body._id);
								(partUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parts if not signed in', function(done) {
		// Create new Part model instance
		var partObj = new Part(part);

		// Save the Part
		partObj.save(function() {
			// Request Parts
			request(app).get('/parts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Part if not signed in', function(done) {
		// Create new Part model instance
		var partObj = new Part(part);

		// Save the Part
		partObj.save(function() {
			request(app).get('/parts/' + partObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', part.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Part instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Part
				agent.post('/parts')
					.send(part)
					.expect(200)
					.end(function(partSaveErr, partSaveRes) {
						// Handle Part save error
						if (partSaveErr) done(partSaveErr);

						// Delete existing Part
						agent.delete('/parts/' + partSaveRes.body._id)
							.send(part)
							.expect(200)
							.end(function(partDeleteErr, partDeleteRes) {
								// Handle Part error error
								if (partDeleteErr) done(partDeleteErr);

								// Set assertions
								(partDeleteRes.body._id).should.equal(partSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Part instance if not signed in', function(done) {
		// Set Part user 
		part.user = user;

		// Create new Part model instance
		var partObj = new Part(part);

		// Save the Part
		partObj.save(function() {
			// Try deleting Part
			request(app).delete('/parts/' + partObj._id)
			.expect(401)
			.end(function(partDeleteErr, partDeleteRes) {
				// Set message assertion
				(partDeleteRes.body.message).should.match('User is not logged in');

				// Handle Part error error
				done(partDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Part.remove().exec();
		done();
	});
});