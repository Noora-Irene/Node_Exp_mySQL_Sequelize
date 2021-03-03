const Sequelize = require('sequelize');
const sequelize = new Sequelize('flowers-online', 'root', 'flowersboutique', {
   dialect: 'mysql'
});

module.exports = sequelize;