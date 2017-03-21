var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from: from,
    text: text,
    createdTimestamp: moment().valueOf(),
  };
};

var generateLocationMessage = (from, longitude, latitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${longitude},${latitude}`,
    createdTimestamp: moment().valueOf(),
  };
};

module.exports = {generateMessage, generateLocationMessage};
