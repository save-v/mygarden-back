module.exports = (sequelize, DataTypes) => {
  class Plant extends sequelize.constructor.Model {
    static associate(db) {
      this.belongsTo(db.category, {
        foreignKey: 'category_id',
        targetKey: 'id',
        as: 'Category'
      })
      this.belongsTo(db.user, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'User'
      })
    }
  }
  Plant.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    category_id: DataTypes.INTEGER(11).UNSIGNED,
    name: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'plant',
    tableName: 'plant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Plant
}
