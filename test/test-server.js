// DO NOT RUN THESE - deprecated

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var should = chai.should();
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../server/config/config.json')[env];
var Sequelize = require('sequelize');
var models = require('../server/models/index');

chai.use(chaiHttp);


// Create sequelize connections
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database,
                                config.username,
                                config.password,
                                config);
}

describe('Testing Users and Messages', () => {


  // Insert some records before each test
  beforeEach( (done) => {
    models.User.sync({
      force: true,
      logging: console.log
    }).then( () => {
      models.User.bulkCreate([{
        id: 999,
        firstName: "Zhanwen",
        lastName: "Chen",
        email: "zhanwenchen@fakemail.com",
        password: "12345678"
      }, {
        id: 1000,
        firstName: "Yilin",
        lastName: "Chen",
        email: "yilinchen@fakemail.com",
        password: "12345678"
      }]).then( () => {
        done();
      });
    });
  });


  // Delete inserted records before each test
  afterEach( (done) => {
    models.User.destroy({
      where: {
        id: [999, 1000]
      }
    }).then( () => {
      models.User.sync({
        force: true,
        logging: console.log
      }).then( () => {
        done();
      });
    })
  });


  it('should READ ALL users on /users GET', (done) => {
    chai.request(server)
      .get('/users')
      .end( (err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('firstName');
        res.body[0].should.have.property('lastName');
        res.body[0].firstName.should.equal('Zhanwen');
        res.body[0].lastName.should.equal('Chen');
        res.body[0].email.should.equal('zhanwenchen@fakemail.com');

        res.body[1].should.have.property('id');
        res.body[1].should.have.property('firstName');
        res.body[1].should.have.property('lastName');
        res.body[1].firstName.should.equal('Yilin');
        res.body[1].lastName.should.equal('Chen');
        res.body[1].email.should.equal('yilinchen@fakemail.com');
        done();
      });
  });

  it('should READ a SINGLE user on /user/<id> GET', (done) => {
    chai.request(server)
      .get('/user/' + 1000)
      .end( (err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        res.body.firstName.should.equal('Yilin');
        res.body.lastName.should.equal('Chen');
        res.body.email.should.equal('yilinchen@fakemail.com');
        res.body.password.should.equal('12345678');
        done();
      });
    });

  it('should CREATE a SINGLE user on /user POST', (done) => {
    chai.request(server)
      .post('/user')
      .send({
        'firstName': 'Jada',
        'lastName': 'Sacco',
        'email': 'jadasacco@fakemail.com',
        'password': '12345678'
      })
      .end( (err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        res.body.should.have.property('email');
        res.body.should.have.property('password');
        res.body.firstName.should.equal('Jada');
        res.body.lastName.should.equal('Sacco');
        res.body.email.should.equal('jadasacco@fakemail.com');
        res.body.password.should.equal('12345678');
        done();
      });
    });


  it('should UPDATE a SINGLE user on /user/<id> PUT', (done) => {
    chai.request(server)
      .get('/user')
      .end( (err, res) => {
        chai.request(server)
          .put('/user/'+1000)
          .send({'password': '87654321'})
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('password');
            response.body.password.should.equal('87654321');
            done();
        });
      });
  });

  it('should delete a SINGLE user on /user/<id> DELETE', (done) => {
    chai.request(server)
      .get('/user/' + 1000)
      .end( (err, res) => {
        chai.request(server)
          .delete('/user/' + 1000)
          .end( (err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.be.a('object');
            res.body.should.have.property('firstName');
            res.body.should.have.property('id');
            res.body.firstName.should.equal('Yilin');
            done();
      });
    });
  });

  // it('should CREATE a SINGLE message on /message/<id> POST', (done) => {
  //   beforeEach( (done) => {
  //     models.Message.sync({
  //       force: true,
  //       logging: console.log
  //     }).then( () => {
  //       models.Message.bulkCreate([{
  //         id: 2,
  //         text: "sup bro",
  //         sender: DataTypes.STRING,
  //         room: DataTypes.STRING
  //       }, {
  //         id: 3,
  //         text: "sup sis",
  //         sender: DataTypes.STRING,
  //         room: DataTypes.STRING
  //       }]).then( () => {
  //         done();
  //       });
  //     });
  //   });

});
