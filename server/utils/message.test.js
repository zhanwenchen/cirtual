var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    // store assertion in response
    var from = 'Phil';
    var text = 'Be my friend?';
    var message = generateMessage(from, text);
    // asset from matches value passed in
    expect(message.createdTimestamp).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct locationMessage object', () => {
    // store assertion in response
    var from = 'Phil';
    var longitude = '41.700370788574';
    var latitude = '-73.920967102051';
    var url = `https://www.google.com/maps?q=${longitude},${latitude}`;
    var message = generateLocationMessage(from, longitude, latitude);
    // asset from matches value passed in
    expect(message.createdTimestamp).toBeA('number');
    expect(message).toInclude({from, url});
  });
});
