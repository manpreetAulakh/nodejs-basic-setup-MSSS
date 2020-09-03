const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const dotenv = require('dotenv');
const AdminBroSequelize = require('@admin-bro/sequelize')
// const db = require('../models');
const User = require('../models/User');

dotenv.config({ path: '.env.example' });
AdminBro.registerAdapter(AdminBroSequelize);



const adminBro = new AdminBro({
//   databases: [db],
  resources: [User],
  rootPath: '/admin',
})


exports.adminBroRouter = AdminBroExpress.buildRouter(adminBro);

exports.adminBro = adminBro;