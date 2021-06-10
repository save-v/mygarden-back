/* eslint-disable max-len */
exports.initialize = (syncForse, db) => {
  if (syncForse) {
    const { Op } = db.Sequelize

    // role
    db.role.create({ id: 1, name: 'user', title: 'користувач' })
    db.role.create({ id: 2, name: 'admin', title: 'адміністратор' })
    db.role.create({ id: 3, name: 'pm', title: 'менеджер' })

    // user & user_role
    db.user.create({
      id: 1,
      name: 'admin',
      email: 'admin@gmail.com',
      phone: '0984070701',
      password: '$2a$08$g2o2SfkV8o3n4lxpwjILkuj/cKZQOO//HuDaZYRDUG32SewR05saq',
      is_confirmed: 'Y',
      is_archived: 'N'
    }).then((user) => {
      db.role.findAll({
        where: { name: { [Op.or]: ['admin'] } }
      }).then((roles) => {
        user.setRoles(roles)
      })
    })

    // TEST DATA!

    // user & user_role
    db.user.create({
      id: 2,
      name: 'test',
      email: 'test@gmail.com',
      phone: '555',
      password: '$2a$08$X0fKaiMOIrrevn0vyLcSuusniVlY/2bOM1aoh3rV9SSLw6E1R1hxu',
      is_confirmed: 'N',
      is_archived: 'N'
    }).then((user) => {
      db.role.findAll({
        where: { name: { [Op.or]: ['user'] } }
      }).then((roles) => {
        user.setRoles(roles)
      })
    })

    // category
    db.category.create({ id: 1, name: 'Яблоня', Latin_name: 'Malus', description: ' Род листопадных деревьев и кустарников семейства Розовые (Rosaceae) с шаровидными сладкими или кисло-сладкими плодами.' })
    db.category.create({ id: 2, name: 'Груша', Latin_name: 'Pyrus', description: ' Род плодовых и декоративных деревьев и кустарников семейства Розовые (Rosaceae).' })
    db.category.create({ id: 3, name: 'Вишня', Latin_name: 'Prunus subg. Cerasus', description: ' Род листопадных деревьев и кустарников семейства Розовые (Rosaceae) с шаровидными сладкими или кисло-сладкими плодами.' })
    db.category.create({ id: 4, name: 'Персик', Latin_name: 'Prunus persica', description: ' Растение из подрода Миндаль рода Слива семейства Розовые.' })
    db.category.create({ id: 5, name: 'Кизил', Latin_name: 'Cornus', description: ' Род растений семейства Кизиловые, состоящий примерно из 50 видов. В основном это древесные листопадные растения, жизненная форма которых — деревья или кустарники.' })

    // plant
    for (let i = 1; i < 10; i++) {
      db.plant.create({
        id: i,
        category_id: 1,
        name: `plant name ${i}`,
        notes: `plant notes ${i}`,
        user_id: 1
      })
    }
    // plant
    for (let i = 10; i < 20; i++) {
      db.plant.create({
        id: i,
        category_id: 2,
        name: `plant name ${i}`,
        notes: `plant notes ${i}`,
        user_id: 1
      })
    }
  }
}
