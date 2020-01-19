const verifySignUp = require('./verifySignUp')
const authJwt = require('./verifyJwtToken')

const controller = require('../controller/controller.js')

module.exports = function router(app) {
  app.post('/api/auth/signup', [verifySignUp.checkDuplicateEmail], controller.signup)
  app.post('/api/auth/signin', controller.signin)
  app.get('/api/auth/access', [authJwt.verifyToken], controller.access)

  app.get('/api/dictionary', controller.dictionary)
  app.get('/api/plants', [authJwt.verifyToken], controller.plants)
  app.get('/api/plant/:id', controller.plant)
  app.post('/api/plantSave', [authJwt.verifyToken], controller.plantSave)
  app.get('/api/catplants/:id', controller.catplants)
}
