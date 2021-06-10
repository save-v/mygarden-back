module.exports = (sequelize, DataTypes) => {
  class Role extends sequelize.constructor.Model {}
  Role.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'role',
    tableName: 'role',
    timestamps: false
  })

  return Role
}
