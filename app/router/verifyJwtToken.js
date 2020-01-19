const jwt = require('jsonwebtoken')

const config = require('../config/config.js')
const db = require('../config/db.config.js')

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    res.status(403).send({
      message: 'No token provided.'
    })
    return
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(500).send({
        message: `Fail to Authentication. Error: ${err}`
      })
      return
    }
    req.user_id = decoded.id
    next()
  })
}

const isAdmin = (req, res, next) => {
  db.user.findByPk(req.user_id)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name.toLowerCase() === 'admin') {
            next()
            return
          }
        }
        res.status(403).send('Require Admin Role!')
      })
    })
}

const isPmOrAdmin = (req, res, next) => {
  db.user.findByPk(req.user_id)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name.toLowerCase() === 'pm') {
            next()
            return
          }
          if (roles[i].name.toLowerCase() === 'admin') {
            next()
            return
          }
        }
        res.status(403).send('Require PM or Admin Roles!')
      })
    })
}

const authJwt = {}
authJwt.verifyToken = verifyToken
authJwt.isAdmin = isAdmin
authJwt.isPmOrAdmin = isPmOrAdmin

module.exports = authJwt
