'use strict';

module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ConversationId: DataTypes.INTEGER,
    ConversationStringId: DataTypes.STRING,
    createdTimestamp: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  }, {
    classMethods: {
      associate: (models) => {
        Message.belongsTo(models.User);
        Message.belongsTo(models.Conversation);
      }
    }
  });
  return Message;
};
