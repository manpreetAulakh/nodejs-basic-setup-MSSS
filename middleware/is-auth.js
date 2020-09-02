const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config({ path: '.env.example' });

module.exports = (req, res, next) => {

  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      //NOTE: if jwt expired, err will contain this, send him/her to login page if token has expired
      // err = {
      //   name: 'TokenExpiredError',
      //   message: 'jwt expired',
      //   expiredAt: 1408621000
      // }
      throw err;
    }
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    next(error);
  }
  
};
