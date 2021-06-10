const verifySignUp = require('./verifySignUp')
const authJwt = require('./verifyJwtToken')

const controller = require('../controller/controller.js')

module.exports = function router(app) {
  app.post('/api/auth/signup', [verifySignUp.checkDuplicateEmail], controller.signup)
  app.post('/api/auth/signin', controller.signin)
  app.get('/api/auth/access', [authJwt.verifyToken], controller.access)
  app.post('/api/saveProfile', [authJwt.verifyToken], controller.saveProfile)
  app.post('/api/sendMessage', [authJwt.verifyTokenIfExists], controller.sendMessage)
  app.get('/api/messages', [authJwt.verifyToken, authJwt.isAdmin], controller.messages)

  app.get('/api/dictionary', controller.dictionary)
  app.get('/api/plants', [authJwt.verifyToken], controller.plants)
  app.get('/api/plant/:id', controller.plant)
  app.post('/api/plantSave', [authJwt.verifyToken], controller.plantSave)
  app.get('/api/catplants/:id', controller.catplants)
}
