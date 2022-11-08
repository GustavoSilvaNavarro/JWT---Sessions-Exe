const bcrypt = require('bcrypt');

const UserModel = require('../models/user');

const create = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (userExist) return res.status(400).json({ message: 'User already exists.' });

    if (email && password) {
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({ email, password: hashPass, firstName, lastName });

      req.session.userId = newUser.id;

      return res.status(201).json(newUser);
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
        req.session.userId = userFound.id;
        return res.status(200).json({ message: 'Success' });
      }
      return res.status(400).json({ message: 'Credentials invalid '});
    }
  } catch (err) {
    console.error(err);
  }
};

const profile = async (req, res) => {
  try {
    let result = await UserModel.findById(req.session.userId);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) throw err;

      console.log(req.session);
      return res.status(200).json({ message: 'Session deleted' });
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { create, login, profile, logout };
