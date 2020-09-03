const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./util/database');
const compression = require('compression');
const authRoutes = require('./routes/auth');
const adminBroRoutes = require('./routes/admin-bro');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/*
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('host', process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', express.static(path.join(__dirname, 'public')));

/**
 * Primary app routes.
 */
app.use(adminBroRoutes.adminBro.options.rootPath, adminBroRoutes.adminBroRouter);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});



sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(app.get('port'), () => {
      console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
      console.log('  Press CTRL-C to stop\n');
    });
  }).catch(error => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = app;
