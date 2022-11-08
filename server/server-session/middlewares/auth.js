const UserModels = require('../models/user');

const authMiddleware = async (req, res, next) => {
  if (req.sessionID && req.session.userId) {
    const user = await UserModels.findById(req.session.userId);
    if (user) return next();
  }

  return res.status(401).json({ message: 'Not Authorized' });
};

module.exports = authMiddleware;
