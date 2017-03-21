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

describe('Testing Users', () => {


  // Insert 1 record before each test
  beforeEach( (done) => {
    models.User.sync({
      force: true,
      logging: console.log
    }).then( () => {
      models.User.create({
        id: 999,
        firstName: "Zhanwen",
        lastName: "Chen",
        email: "zhanwenchen@fakemail.com",
        password: "12345678"
      }).then( () => {
        done();
      });
    });
  });


  // Delete inserted record before each test
  afterEach( (done) => {
    models.User.destroy({
      where: {
        id: 999
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


  it('should list ALL users on /users GET', (done) => {
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
        done();
      });
  });

  it('should add a SINGLE user on /user POST', function(done) {
    chai.request(server)
      .post('/user')
      .send({
        'firstName': 'Jada',
        'lastName': 'Sacco',
        'email': 'jadasacco@fakemail.com',
        'password': '12345678'
      })
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.be.a('object');
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        res.body.should.have.property('id');
        res.body.firstName.should.equal('Jada');
        res.body.lastName.should.equal('Sacco');
        res.body.email.should.equal('jadasacco@fakemail.com');
        res.body.password.should.equal('12345678');
        done();
      });
    });
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});
