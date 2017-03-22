var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var models = require('../models/index');

module.exports = (passport) => {

	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
		console.log('in callback');
    findOrCreateUser = () => {
	    // find a user in MySQL with provided email
	    models.User.findOne({
				where: {
					'email' :  email
				}
			}).then( (user) => {
        // In case of any error, return using the done method
        // if (err){
        //     console.log('Error in SignUp: '+err);
				// 		console.log(err.stack);
        //     return done(err);
        // }
        // already exists
        if (user) {
            console.log('User already exists with email: ' + email);
						console.log(user);
            return done(null, false, req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email, create the user
					console.log('About to create user');
					models.User.create({
						email: req.body.email,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						password: createHash(password)
					}).then( (user) => {
						// if (err) {
						// 	console.log('Error in Saving user: '+err);
						// 	console.log(err);
						// 	throw err;
						// }
						console.log('User Registration succesful');
						return done(null, user.dataValues);
					});
        }
    });
	};
	// Delay the execution of findOrCreateUser and execute the method
	// in the next tick of the event loop
	process.nextTick(findOrCreateUser);
	})
);

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
