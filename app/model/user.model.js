module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.constructor.Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    is_confirmed: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    is_archived: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return User
}
