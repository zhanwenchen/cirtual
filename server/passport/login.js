var LocalStrategy  = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var models = require('../models/index');

module.exports = (passport) => {

	passport.use('login', new LocalStrategy({
		usernameField: 'email',
    passReqToCallback : true
  }, (req, email, password, done) => {
    // check in MySQL if a user with email exists or not
    models.User.findOne({
			where: {
				'email' :  email
			}
		}).then( (user) => {
      // In case of any error, return using the done method
          // if (err)
            // return done(err);
          // email does not exist, log the error and redirect back
      if (!user.dataValues.email){
          console.log('User Not Found with email '+email);
          return done(null, false, req.flash('message', 'User Not found.'));
      }
      // User exists but wrong password, log the error
      if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
      }
      // User and password both match, return user from done method
      // which will be treated like success
			// console.log('login almost succeeded. User is ' + user.dataValues);
      return done(null, user);
    });
	}));

  var isValidPassword =  (user, password) => {
		truthValue = bCrypt.compareSync(password, user.dataValues.password);
    return bCrypt.compareSync(password, user.dataValues.password);
  };

}
