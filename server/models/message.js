'use strict';

module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    room: DataTypes.INTEGER,
    createdTimestamp: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  }, {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.User);
      }
    }
  });
  return Message;
};
