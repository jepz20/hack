'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contribuyente = mongoose.model('Contribuyente'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, contribuyente;

/**
 * Contribuyente routes tests
 */
describe('Contribuyente CRUD tests', function() {
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

		// Save a user to the test db and create new Contribuyente
		user.save(function() {
			contribuyente = {
				name: 'Contribuyente Name'
			};

			done();
		});
	});

	it('should be able to save Contribuyente instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contribuyente
				agent.post('/contribuyentes')
					.send(contribuyente)
					.expect(200)
					.end(function(contribuyenteSaveErr, contribuyenteSaveRes) {
						// Handle Contribuyente save error
						if (contribuyenteSaveErr) done(contribuyenteSaveErr);

						// Get a list of Contribuyentes
						agent.get('/contribuyentes')
							.end(function(contribuyentesGetErr, contribuyentesGetRes) {
								// Handle Contribuyente save error
								if (contribuyentesGetErr) done(contribuyentesGetErr);

								// Get Contribuyentes list
								var contribuyentes = contribuyentesGetRes.body;

								// Set assertions
								(contribuyentes[0].user._id).should.equal(userId);
								(contribuyentes[0].name).should.match('Contribuyente Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Contribuyente instance if not logged in', function(done) {
		agent.post('/contribuyentes')
			.send(contribuyente)
			.expect(401)
			.end(function(contribuyenteSaveErr, contribuyenteSaveRes) {
				// Call the assertion callback
				done(contribuyenteSaveErr);
			});
	});

	it('should not be able to save Contribuyente instance if no name is provided', function(done) {
		// Invalidate name field
		contribuyente.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contribuyente
				agent.post('/contribuyentes')
					.send(contribuyente)
					.expect(400)
					.end(function(contribuyenteSaveErr, contribuyenteSaveRes) {
						// Set message assertion
						(contribuyenteSaveRes.body.message).should.match('Please fill Contribuyente name');
						
						// Handle Contribuyente save error
						done(contribuyenteSaveErr);
					});
			});
	});

	it('should be able to update Contribuyente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contribuyente
				agent.post('/contribuyentes')
					.send(contribuyente)
					.expect(200)
					.end(function(contribuyenteSaveErr, contribuyenteSaveRes) {
						// Handle Contribuyente save error
						if (contribuyenteSaveErr) done(contribuyenteSaveErr);

						// Update Contribuyente name
						contribuyente.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Contribuyente
						agent.put('/contribuyentes/' + contribuyenteSaveRes.body._id)
							.send(contribuyente)
							.expect(200)
							.end(function(contribuyenteUpdateErr, contribuyenteUpdateRes) {
								// Handle Contribuyente update error
								if (contribuyenteUpdateErr) done(contribuyenteUpdateErr);

								// Set assertions
								(contribuyenteUpdateRes.body._id).should.equal(contribuyenteSaveRes.body._id);
								(contribuyenteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Contribuyentes if not signed in', function(done) {
		// Create new Contribuyente model instance
		var contribuyenteObj = new Contribuyente(contribuyente);

		// Save the Contribuyente
		contribuyenteObj.save(function() {
			// Request Contribuyentes
			request(app).get('/contribuyentes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Contribuyente if not signed in', function(done) {
		// Create new Contribuyente model instance
		var contribuyenteObj = new Contribuyente(contribuyente);

		// Save the Contribuyente
		contribuyenteObj.save(function() {
			request(app).get('/contribuyentes/' + contribuyenteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', contribuyente.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Contribuyente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contribuyente
				agent.post('/contribuyentes')
					.send(contribuyente)
					.expect(200)
					.end(function(contribuyenteSaveErr, contribuyenteSaveRes) {
						// Handle Contribuyente save error
						if (contribuyenteSaveErr) done(contribuyenteSaveErr);

						// Delete existing Contribuyente
						agent.delete('/contribuyentes/' + contribuyenteSaveRes.body._id)
							.send(contribuyente)
							.expect(200)
							.end(function(contribuyenteDeleteErr, contribuyenteDeleteRes) {
								// Handle Contribuyente error error
								if (contribuyenteDeleteErr) done(contribuyenteDeleteErr);

								// Set assertions
								(contribuyenteDeleteRes.body._id).should.equal(contribuyenteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Contribuyente instance if not signed in', function(done) {
		// Set Contribuyente user 
		contribuyente.user = user;

		// Create new Contribuyente model instance
		var contribuyenteObj = new Contribuyente(contribuyente);

		// Save the Contribuyente
		contribuyenteObj.save(function() {
			// Try deleting Contribuyente
			request(app).delete('/contribuyentes/' + contribuyenteObj._id)
			.expect(401)
			.end(function(contribuyenteDeleteErr, contribuyenteDeleteRes) {
				// Set message assertion
				(contribuyenteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Contribuyente error error
				done(contribuyenteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Contribuyente.remove().exec();
		done();
	});
});