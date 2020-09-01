const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sass = require('node-sass-middleware');
const multer = require('multer');
const path = require('path');
const sequelize = require('./util/database');
const compression = require('compression');

const User = require('./models/User');

const upload = multer({ dest: path.join(__dirname, 'uploads') });


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');

/*
 * Create Express server.
 */
const app = express();


/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
// app.get('/login', userController.getLogin);
// app.post('/login', userController.postLogin);
// app.get('/logout', userController.logout);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);
// app.get('/signup', userController.getSignup);
// app.post('/signup', userController.postSignup);


sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    console.log('Connection has been established successfully.',result);
  //   const jane = User.create({
  //     name: 'jane doe',
  //   });
  //   return jane;
  // }).then(result=> {
  //   console.log(result.toJSON());
    app.listen(3000);
  }) .catch (error => {
    console.error('Unable to connect to the database:', error);
  });

  
  
  module.exports = app;
  