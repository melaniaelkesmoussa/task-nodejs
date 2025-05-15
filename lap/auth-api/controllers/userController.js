const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    if (!password || password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const newUser = await User.create({ name, email, password });
    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id, user.role);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
