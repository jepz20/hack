'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Proyecto = mongoose.model('Proyecto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, proyecto;

/**
 * Proyecto routes tests
 */
describe('Proyecto CRUD tests', function() {
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

		// Save a user to the test db and create new Proyecto
		user.save(function() {
			proyecto = {
				name: 'Proyecto Name'
			};

			done();
		});
	});

	it('should be able to save Proyecto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proyecto
				agent.post('/proyectos')
					.send(proyecto)
					.expect(200)
					.end(function(proyectoSaveErr, proyectoSaveRes) {
						// Handle Proyecto save error
						if (proyectoSaveErr) done(proyectoSaveErr);

						// Get a list of Proyectos
						agent.get('/proyectos')
							.end(function(proyectosGetErr, proyectosGetRes) {
								// Handle Proyecto save error
								if (proyectosGetErr) done(proyectosGetErr);

								// Get Proyectos list
								var proyectos = proyectosGetRes.body;

								// Set assertions
								(proyectos[0].user._id).should.equal(userId);
								(proyectos[0].name).should.match('Proyecto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Proyecto instance if not logged in', function(done) {
		agent.post('/proyectos')
			.send(proyecto)
			.expect(401)
			.end(function(proyectoSaveErr, proyectoSaveRes) {
				// Call the assertion callback
				done(proyectoSaveErr);
			});
	});

	it('should not be able to save Proyecto instance if no name is provided', function(done) {
		// Invalidate name field
		proyecto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proyecto
				agent.post('/proyectos')
					.send(proyecto)
					.expect(400)
					.end(function(proyectoSaveErr, proyectoSaveRes) {
						// Set message assertion
						(proyectoSaveRes.body.message).should.match('Please fill Proyecto name');
						
						// Handle Proyecto save error
						done(proyectoSaveErr);
					});
			});
	});

	it('should be able to update Proyecto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proyecto
				agent.post('/proyectos')
					.send(proyecto)
					.expect(200)
					.end(function(proyectoSaveErr, proyectoSaveRes) {
						// Handle Proyecto save error
						if (proyectoSaveErr) done(proyectoSaveErr);

						// Update Proyecto name
						proyecto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Proyecto
						agent.put('/proyectos/' + proyectoSaveRes.body._id)
							.send(proyecto)
							.expect(200)
							.end(function(proyectoUpdateErr, proyectoUpdateRes) {
								// Handle Proyecto update error
								if (proyectoUpdateErr) done(proyectoUpdateErr);

								// Set assertions
								(proyectoUpdateRes.body._id).should.equal(proyectoSaveRes.body._id);
								(proyectoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Proyectos if not signed in', function(done) {
		// Create new Proyecto model instance
		var proyectoObj = new Proyecto(proyecto);

		// Save the Proyecto
		proyectoObj.save(function() {
			// Request Proyectos
			request(app).get('/proyectos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Proyecto if not signed in', function(done) {
		// Create new Proyecto model instance
		var proyectoObj = new Proyecto(proyecto);

		// Save the Proyecto
		proyectoObj.save(function() {
			request(app).get('/proyectos/' + proyectoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', proyecto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Proyecto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proyecto
				agent.post('/proyectos')
					.send(proyecto)
					.expect(200)
					.end(function(proyectoSaveErr, proyectoSaveRes) {
						// Handle Proyecto save error
						if (proyectoSaveErr) done(proyectoSaveErr);

						// Delete existing Proyecto
						agent.delete('/proyectos/' + proyectoSaveRes.body._id)
							.send(proyecto)
							.expect(200)
							.end(function(proyectoDeleteErr, proyectoDeleteRes) {
								// Handle Proyecto error error
								if (proyectoDeleteErr) done(proyectoDeleteErr);

								// Set assertions
								(proyectoDeleteRes.body._id).should.equal(proyectoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Proyecto instance if not signed in', function(done) {
		// Set Proyecto user 
		proyecto.user = user;

		// Create new Proyecto model instance
		var proyectoObj = new Proyecto(proyecto);

		// Save the Proyecto
		proyectoObj.save(function() {
			// Try deleting Proyecto
			request(app).delete('/proyectos/' + proyectoObj._id)
			.expect(401)
			.end(function(proyectoDeleteErr, proyectoDeleteRes) {
				// Set message assertion
				(proyectoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Proyecto error error
				done(proyectoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Proyecto.remove().exec();
		done();
	});
});