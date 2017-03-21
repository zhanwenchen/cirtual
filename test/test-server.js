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

describe('Testing Users', function() {


  // Insert 1 record before each test
  beforeEach(function(done){
    models.User.create({
      id: 999,
      firstName: "Zhanwen",
      lastName: "Chen",
      email: "phil.zhanwen.chen@gmail.com"
    }).success(() => {
      done();
    });
  });


  // Delete inserted record before each test
  afterEach(function(done){
    User.destroy({ id: 999 }).success(()=>{
      done();
    })
  });


  it('should list ALL users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  // Good code
  it('It should create Fish table, Fish and Eye table with Eye as Fish child', function () {
    return sequelize.sync({
      force: true,
      logging: console.log
    }).then(() => {
      return User.create({
        id: 999,
        firstName: "Zhanwen",
        lastName: "Chen",
        email: "phil.zhanwen.chen@gmail.com"
      }).then(function () {
        return Message.create({
          id: 2,
          FishId: 2,
          name: 'Test Eye 2' })
      });
    });
  });

  it('should add a SINGLE user on /users POST', function(done) {
    chai.request(server)
      .post('/users')
      .send({'name': 'Java', 'lastName': 'Script'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('name');
        res.body.SUCCESS.should.have.property('lastName');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.name.should.equal('Java');
        res.body.SUCCESS.lastName.should.equal('Script');
        done();
      });
    });
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});
