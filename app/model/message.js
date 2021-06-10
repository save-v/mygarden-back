module.exports = (sequelize, DataTypes) => {
  class Message extends sequelize.constructor.Model {
    static associate(db) {
      this.belongsTo(db.user, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'User'
      })
    }
  }
  Message.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: DataTypes.TEXT,
    message: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'message',
    tableName: 'message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Message
}
