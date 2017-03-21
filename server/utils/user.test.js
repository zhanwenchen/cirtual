const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Phil',
      room: 'CS Memes',
    }, {
      id: '2',
      name: 'Audrey',
      room: 'CS Memes',
    }, {
      id: '3',
      name: 'Katie',
      room: 'CdT',
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Phil',
      room: 'CS Memes'
    };
    var res = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove user', () => {
    audreyId = '2';
    users.removeUser(audreyId);
    removedArray = users.users.map((user) => user.name);
    expect(removedArray).toEqual(['Phil', 'Katie']);
  });

  it('should not remove user', () => {
    nullId = '99';
    var nullUser = users.removeUser(nullId);
    removedArray = users.users.map((user) => user.name);
    expect(nullUser).toNotExist();
    expect(removedArray).toEqual(['Phil', 'Audrey', 'Katie']);
  });

  it('should find user', () => {
    var philId = '1';
    var phil = users.getUser(philId);
    expect(phil.id).toEqual('1');
  });

  it('should not find user', () => {
    var nullUser = users.getUser('4');
    expect(nullUser).toNotExist();
  });

  it('should return names for CS Memes', () => {
    var userList = users.getUserList('CS Memes');
    expect(userList).toEqual(['Phil', 'Audrey']);
  });

  it('should return names for CdT', () => {
    var userList = users.getUserList('CdT');
    expect(userList).toEqual(['Katie']);
  })

});
