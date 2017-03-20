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
// TODO: change to MySQL
// const pg = require('pg');
const sequelize = require('sequelize');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/communityhack_test';


var models = require('../models/index');

// View root page
app.get('/', (req, res, next) => {
  console.log("./ = %s", path.resolve("./"));
  console.log("__dirname = %s", path.resolve(__dirname));
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
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
    email: req.body.email,
    password: req.body.password
  }).then(function(user) {
    res.json(user);
  });
});


// JSON endpoint: Update a single user
app.put('/user/:id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    if(todo){
      todo.updateAttributes({
        title: req.body.title,
        complete: req.body.complete
      }).then(function(todo) {
        res.send(todo);
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
app.post('/message/new/:recipient_id', function(req, res) {
  models.Message.create({
    text: req.body.text,
    sender_id: req.body.user_id,
    recipient_id: req.params.recipient_id
  }).then(function(message) {
    res.json(message);
  });
});


module.exports = app;
