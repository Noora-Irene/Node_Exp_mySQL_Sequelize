const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const errorController = require('./controllers/error404');
const sequelize = require('./aider/database');

const Article = require('./models/article');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const exp = express();

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;
exp.set('view engine', 'ejs');

const adminRout = require('./routes/admin');
const boutiqueRout = require('./routes/boutique');

exp.use(bodyParser.urlencoded({ extended: false }));
exp.use(express.static(path.join(__dirname, 'public')));

exp.use((req, res, next) => {
   User.findByPk(1)
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
});

exp.use('/admin', adminRout);
exp.use(boutiqueRout);
exp.use(errorController.get404);

Article.belongsTo(User, {
   constraints: true,
   onDelete: 'CASCADE'
});
User.hasMany(Article);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Article, { through: CartItem });
Article.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Article, { through: OrderItem });

sequelize
   .sync({ force: false /* true resets db */ })
   .then(result => {
      return User.findByPk(1);
   })
   .then(user => {
      if (!user) {
         return User.create({ name: 'Janni', email: 'test@test.com' });
      }
      return user;
   })
   .then(user => {
      return user.createCart();
   })
   .then(cart => {
      exp.listen(port, function () {
         console.log(port);
      });
   })
   .catch(err => {
      console.log(err);
   }); 