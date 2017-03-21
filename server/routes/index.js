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
const passport = require('passport');
var models = require('../models/index');

// View root page
app.get('/', (req, res, next) => {
  console.log("./ = %s", path.resolve("./"));
  console.log("__dirname = %s", path.resolve(__dirname));
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
});

// login function
app.post('/login',
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      successFlash: 'Welcome!',
      failureFlash: 'Invalid username or password.'
    }
  )
);

// logout function with passport
app.get('/logout', function(req, res){
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


module.exports = app;
