const db = require('../config/db.config.js')

const checkDuplicateEmail = (req, res, next) => {
  db.user.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    if (user) {
      return res.status(400).send({ reason: 'Email is already in use!' })
    }
    return next()
  })
}

const signUpVerify = {}
signUpVerify.checkDuplicateEmail = checkDuplicateEmail

module.exports = signUpVerify
