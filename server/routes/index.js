// server/routes/index.js
// API endpoints

// TODO:
// 1. edit user profile
// 2. send message - GUI in addition to JSON
// 		2a. refactor chat to conversation
//    2b. fix conversation forms
// 3. remember user session with passport-remember-me

const express = require('express');
const app = express.Router();
const path = require('path');
const sequelize = require('sequelize');
var models = require('../models/index');


var isAuthenticated = (req, res, next) => {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}


module.exports = (passport) => {

  /* GET login page. */
	app.get('/', (req, res) => {
    // Display the Login page with any flash message, if any
		// console.log('in get /')
		res.render('index', {
			message: req.flash('message')
		});
	});

	/* Handle Login POST */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	app.get('/signup', (req, res) => {
		res.render('register', {
			message: req.flash('message')});
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash : true
	}), (req, res) => {
		console.log('just POSTed to signup');
	});

	// app.post('/signup', (req, res) => {
	// 	console.log('just POSTed to signup');
	// 	console.log(req.body.email);
	// });

	/* GET Profile Page */
	app.get('/profile', isAuthenticated, (req, res) => {
		// console.log('in /profile. req.user.id is ', req.user.id);
		res.render('profile', {
			user: req.user
		});
	});

	/* GET Chat Page */
	app.get('/chat', isAuthenticated, (req, res) => {
		// console.log('in /profile. req.user.id is ', req.user.id);
		res.render('chat', {
			// user: req.user
		});
	});

	/* GET find user Page */
	app.get('/user/find', isAuthenticated, (req, res) => {
		// console.log('in /profile. req.user.id is ', req.user.id);
		res.render('finduser', {
			user: req.user
		});
	});

	/* POST to find user Page */
	app.post('/user/find', isAuthenticated, (req, res) => {
		// console.log('in /profile. req.user.id is ', req.user.id);
		models.User.findAll({
			where: {
				'email': req.body.user_email
			}
		}).then( (results) => {
			console.log('POSTed to /user/find. Results are ', results);
			if (results) {
				var users_found = results;
				res.render('finduser', {
					user: req.user,
					users_found: users_found
				});
			} else {
				res.render('finduser', {
					user: req.user,
					users_found: users_found,
					message: req.flash('users not found')
				});
			}

		})
	});

	/* GET Conversation Page */
	app.get('/conversation', isAuthenticated, (req, res) => {

		if (!('recipients_ids' in req.body))
			throw err('recipients_ids not provided');

		// Get sender and recipients. Join their sorted ids to form a
		// list of users value in conversation table
		var users_array = [req.user.id].concat(req.body.recipients_ids);
		users_array.sort()
		users_array = users_array.join();

		console.log('users_array is ', users_array);

		// look up existing Conversation
		models.Conversation.findOne({
			where: {
				'users_array': users_array
			}
		}).then( (results) => {
			if (results) {
				// conversation among users exists, display previous messages
				models.Message.findAll({
					where: {
						'ConversationStringId': users_array
					}
				}).then( (results) => {
					res.render('conversation', {
						// ignore the returned metadata
						messages: results.map( (obj) => {return obj.dataValues})
					})
				})
			} else {
				// conversation doesn't exist -> create a new one!
				models.Conversation.create({
					users_array: users_array
				}).then( (results) => {
				})
			}
		});
	});

	app.post('/conversation', isAuthenticated, (req, res) => {

		// Get sender and recipients. Join their sorted ids to form a
		// list of users value in conversation table
		var users_array = [req.body.sender_id].concat(req.body.recipients_ids);
		users_array.sort().join();


		// look up existing Conversation
		models.Conversation.findOne({
			where: {
				'users_array': users_array
			}
		}).then( (results) => {
			if (results) {
				// conversation doesn't exist

			}
		})
		models.Message.create({
			text: req.body.text,
			sender: req.user.id,
			room: null
		}).then( (results) => {
			console.log('message posted. results = ', results);
		})
	});

	// /* Update Profile Page */
	// app.put('/profile', isAuthenticated, (req, res) => {
	// 	// console.log('in /profile. req.user.id is ', req.user.id);
	// 	res.render('profile', {
	// 		user: req.user
	// 	});
	// });

	// JSON endpoint: Create a single message
  app.post('/message/new/:room', function(req, res) {
    models.Message.create({
      text: req.body.text,
      UserId: req.body.user_id,
      room: req.params.room
    }).then(function(message) {
      res.json(message);
    });
  });

	/* Handle Logout */
	app.get('/signout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

  // JSON endpoint: Search a single user
  app.get('/user/:id', isAuthenticated, (req, res) => {
    models.User.find({
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      res.json(user);
    });
  });

  // JSON endpoint: List all users
  app.get('/users', isAuthenticated, (req, res) => {
    models.User.findAll({}).then( (users) => {
      res.json(users);
    });
  });


	// JSON endpoint: Retrieve a single message
  app.get('/message/:id', function(req, res) {
    models.Message.find({
      where: {
        id: req.params.id
      }
    }).then(function(message) {
      res.json(message);
    });
  });


	// Below are deprecated

  // // JSON endpoint: Create a new user
  // app.post('/user', (req, res) => {
  //   models.User.create({
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     email: req.body.email,
  //     password: req.body.password
  //   }).then(function(user) {
  //     res.json(user);
  //   });
  // });
	//
	//
  // // JSON endpoint: Update a single user
  // app.put('/user/:id', function(req, res) {
  //   models.User.find({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(function(user) {
  //     if(user){
  //       user.updateAttributes({
  //         firstName: req.body.firstName,
  //         lastName: req.body.lastName,
  //         email: req.body.email,
  //         password: req.body.password,
  //       }).then(function(user) {
  //         res.json(user);
  //       });
  //     }
  //   });
  // });
	//
	//
  // // JSON endpoint: Delete a single user
  // app.delete('/user/:id', function(req, res) {
  //   models.User.find({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then( (user) => {
  //     if(user){
  //       var deletedUser = user;
  //       user.destroy().then( () => {
  //         res.json(deletedUser);
  //       });
  //     }
  //   });
  // });
	//

	//
	//


  return app;
}


// module.exports = app;
