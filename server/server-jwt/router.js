const router = require('express').Router();
const userController = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');

// add the paths for register, login, me, and logout here
router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.profile);
router.get('/logout', authMiddleware, userController.logout);

module.exports = router;
