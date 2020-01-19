module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.constructor.Model {}
  Category.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING(50),
    latin_name: DataTypes.STRING(50),
    description: DataTypes.TEXT()
  }, {
    sequelize,
    modelName: 'category',
    tableName: 'category',
    timestamps: false
  })

  return Category
}
