// server/routes/index.js
// API endpoints for basic functionalities

// TODO:
// 1. register user, (done)
// 2. list users, (done)
// 3. search users (done)
// 4. bonus: view and edit user profile
// 5. send message, (done)
// 6. get messages, (done)

const express = require('express');
const app = express.Router();
const path = require('path');
const sequelize = require('sequelize');
var models = require('../models/index');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}


module.exports = function(passport){

  /* GET login page. */
	app.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	app.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	app.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  // JSON endpoint: Search a single user
  app.get('/user/:id', function(req, res) {
    models.User.find({
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      res.json(user);
    });
  });

  // JSON endpoint: List all users
  app.get('/users', function(req, res) {
    models.User.findAll({}).then(function(users) {
      res.json(users);
    });
  });


  // JSON endpoint: Create a new user
  app.post('/user', function(req, res) {
    models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    }).then(function(user) {
      res.json(user);
    });
  });


  // JSON endpoint: Update a single user
  app.put('/user/:id', function(req, res) {
    models.User.find({
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      if(user){
        user.updateAttributes({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        }).then(function(user) {
          res.json(user);
        });
      }
    });
  });


  // JSON endpoint: Delete a single user
  app.delete('/user/:id', function(req, res) {
    models.User.find({
      where: {
        id: req.params.id
      }
    }).then( (user) => {
      if(user){
        var deletedUser = user;
        user.destroy().then( () => {
          res.json(deletedUser);
        });
      }
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

  return app;
}


// module.exports = app;
