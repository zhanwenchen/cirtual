var bcrypt = require('bcrypt-nodejs')

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Conversation = sequelize.define('Conversation', {
    users_array: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Conversation.hasMany(models.Message, {
          onDelete: 'cascade',
          hooks: true
        });
      }
    }

  });
  return Conversation;
};
