const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (token) {
    const user = jwt.verify(token.split(' ')[1], 'secretKey');
    const userFound = await UserModel.findById(user.id, {
      password: 0,
      __v: 0
    });
    req.user = userFound;
    if (userFound) return next();
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = authMiddleware;
