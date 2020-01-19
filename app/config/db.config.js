const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = require('./env.js')

const sequelize = new Sequelize(env.database, env.username, env.password, {
  logging: false,
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
})

const db = {}

const modelPath = path.join(global.appRoot, 'app/model')
fs.readdirSync(modelPath).filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js')).forEach((file) => {
  const model = sequelize.import(path.join(modelPath, file))
  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.Sequelize = Sequelize
db.sequelize = sequelize

// user_role
db.role.belongsToMany(db.user, {
  through: 'user_role', foreignKey: 'role_id', otherKey: 'user_id', timestamps: false
})
db.user.belongsToMany(db.role, {
  through: 'user_role', foreignKey: 'user_id', otherKey: 'role_id'
})

module.exports = db
