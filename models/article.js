const Sequelize = require('sequelize');
const sequelize = require('../aider/database');

const Article = sequelize.define('article', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   title: Sequelize.STRING,
   price: {
      type: Sequelize.DOUBLE,
      allowNull: false
   },
   image: {
      type: Sequelize.STRING,
      allowNull: false
   },
   description: {
      type: Sequelize.STRING,
      allowNull: false
   }
});

module.exports = Article;