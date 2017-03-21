var login = require('./login');
var signup = require('./signup');
// var User = require('../models/user');
var models = require('../models/index');

module.exports = (passport) => {

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser( (user, done) => {
        // console.log('serializing user: ');
        // console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        // models.User.findById(id, (err, user) => {
        //     console.log('deserializing user:', user);
        //     done(err, user);
        // });
        models.User.findById(id).then( (user) => {
          // console.log('deserializing user. err is ', err);
          console.log('deserializing user:', user.dataValues);
          done(null, user.dataValues);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}
