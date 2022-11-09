const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const blackList = [];

const create = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (userExist) return res.status(400).json({ message: 'User already exists.' });

    if (email && password) {
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({ email, password: hashPass, firstName, lastName });

      const token = jwt.sign({ id: newUser.id, firstName }, 'secretKey', { expiresIn: '1h' });

      return res.status(201).json(token);
    }

    return res.status(400).send('Inputs are missing');
  } catch (err) {
    console.error(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const userFound = await UserModel.findOne({ email });

      const matchPass = await bcrypt.compare(password, userFound.password);

      if (matchPass) {
        const token = jwt.sign({ id: userFound.id, firstName: userFound.firstName }, 'secretKey', { expiresIn: '1h' });
        return res.status(200).json(token);
      }

      return res.status(400).json({ message: 'Credentials invalid '});
    }
  } catch (err) {
    console.error(err);
  }
};

const profile = async (req, res) => {
  try {
    if (blackList.includes(req.headers['authorization'])) return;
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
  }
};

const logout = (req, res) => {
  blackList.push(req.headers['authorization']);
  res.status(200).json({ message: 'Success' });
};

module.exports = { create, login, profile, logout };
