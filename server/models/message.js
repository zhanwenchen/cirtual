'use strict';

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    sender_email: DataTypes.STRING,
    recipient: DataTypes.STRING, // TODO: recipient is a user or a room?
    createdTimestamp: moment().valueOf() // TODO: when does this evaluate?
  }, {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.User);
      }
    }
  });
  return Message;
};
