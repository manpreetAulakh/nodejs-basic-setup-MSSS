const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');
dotenv.config({ path: '.env.example' });

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hashedPassword) {
        const user = new User({
          email: email,
          password: hashedPassword,
          name: name,
        });
        const userCreated = await user.save();
        res.status(201).json({ message: 'User created!', userId: userCreated.id });
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const passwordError = new Error('Wrong password!');
      passwordError.statusCode = 401;
      throw passwordError;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        role: user.role,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );
    res.status(200).json({ token: token, userId: user.id });

  } catch (error) {
    next(error);
  }
};

exports.dummyAPI = async (req, res, next) => {
  res.status(200).json({ userId: req.userId, role: req.userRole});
}
