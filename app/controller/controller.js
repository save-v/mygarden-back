const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const config = require('../config/config.js')
const db = require('../config/db.config.js')

const { Op } = db.Sequelize

exports.signup = (req, res) => {
  db.user.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then((user) => {
    db.role.findAll({
      where: { name: { [Op.or]: ['user'] } }
    }).then((roles) => {
      user.setRoles(roles).then(() => {
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        })
        res.status(200).send({ accessToken: token })
      })
    }).catch((err) => {
      res.status(500).send(`Error: ${err}`)
    })
  }).catch((err) => {
    res.status(500).send(`Fail! Error: ${err}`)
  })
}

exports.signin = (req, res) => {
  db.user.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    if (!user) {
      res.status(404).send({ reason: 'Користувач не знайдений!' })
      return
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) {
      res.status(401).send({ reason: 'Недійсний пароль!' })
      return
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    })
    res.status(200).send({ accessToken: token })
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.access = (req, res) => {
  db.user.findOne({
    where: {
      id: req.user_id,
      is_archived: 'N'
    },
    attributes: ['id', 'name', 'email', 'phone'],
    include: [{
      model: db.role,
      attributes: ['id', 'name', 'title'],
      // through: {
      //   attributes: ['user_id', 'role_id']
      // }
    }]
  }).then((user) => {
    res.status(200).json({
      description: 'Access is allowed',
      user
    })
  }).catch((err) => {
    res.status(500).json({
      description: ' Access is denied',
      error: err
    })
  })
}

// plant
exports.plants = (req, res) => {
  db.plant.findAll({
    where: {
      user_id: req.user_id
    },
    order: [['updated_at', 'DESC']],
    include: [
      {
        model: db.category,
        as: 'Category',
        attributes: ['name']
      },
      {
        model: db.user,
        as: 'User',
        attributes: ['name']
      }
    ]
  }).then((plants) => {
    res.status(200).send(plants)
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.plant = (req, res) => {
  db.plant.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: db.category,
        as: 'Category',
        attributes: ['name']
      },
      {
        model: db.user,
        as: 'User',
        attributes: ['name']
      }
    ]
  }).then((plant) => {
    res.status(200).send(plant)
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.catplants = (req, res) => {
  if (req.params.id === 'all') {
    db.plant.findAll({
      include: [
        {
          model: db.category,
          as: 'Category',
          attributes: ['name']
        },
        {
          model: db.user,
          as: 'User',
          attributes: ['name', 'phone']
        }
      ]
    }).then((plant) => {
      res.status(200).send(plant)
    }).catch((err) => {
      res.status(500).send(`Error: ${err}`)
    })
  } else {
    db.plant.findAll({
      where: {
        category_id: req.params.id
      },
      include: [
        {
          model: db.category,
          as: 'Category',
          attributes: ['name']
        },
        {
          model: db.user,
          as: 'User',
          attributes: ['name', 'phone']
        }
      ]
    }).then((plant) => {
      res.status(200).send(plant)
    }).catch((err) => {
      res.status(500).send(`Error: ${err}`)
    })
  }
}

exports.plantSave = (req, res) => {
  if (req.body.id) {
    this.plantUpdate(req, res)
  } else {
    this.plantInsert(req, res)
  }
}

exports.plantInsert = (req, res) => {
  db.plant.create({
    category_id: req.body.category_id,
    name: req.body.name,
    notes: req.body.notes,
    user_id: req.user_id
  }).then((result) => {
    res.status(200).send({ id: result.id })
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.plantUpdate = (req, res) => {
  db.plant.update({
    category_id: req.body.category_id,
    name: req.body.name,
    notes: req.body.notes
  }, {
    where: {
      id: req.body.id,
      user_id: req.user_id
    }
  }).then(() => {
    res.status(200).send()
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

// dictionary
exports.dictionary = async (req, res) => {
  res.status(200).send({
    categoryList: await db.category.findAll()
  })
}

// others
exports.getUserName = async (id) => {
  const user = await db.user.findByPk(id)
  return user.name
}

exports.saveProfile = (req, res) => {
  db.user.update({
    name: req.body.name,
    phone: req.body.phone
  }, {
    where: {
      id: req.user_id
    }
  }).then(() => {
    res.status(200).send()
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.sendMessage = (req, res) => {
  db.message.create({
    email: req.body.email,
    message: req.body.message,
    user_id: req.user_id
  }).then((result) => {
    res.status(200).send({ id: result.id })
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}

exports.messages = (req, res) => {
  db.message.findAll({
    order: [['updated_at', 'DESC']],
    include: [
      {
        model: db.user,
        as: 'User',
        attributes: ['name', 'email', 'phone']
      }
    ]
  }).then((messages) => {
    res.status(200).send(messages)
  }).catch((err) => {
    res.status(500).send(`Error: ${err}`)
  })
}
