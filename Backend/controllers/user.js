const User = require('../models/user');
const bcrypt = require('bcrypt');
exports.signupUser = async (req, res, next) => {
  const { name, mail, password } = req.body;
  if (name === '' || mail === '' || password === '') {
    return res.status(400).json({ error: 'Enter required details' });
  }
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await User.create({ name: name, mail: mail, password: hash });
    res.status(200).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ error: 'User already exists' });
  }
};

exports.loginUser = async (req, res, next) => {
  const { mail, password } = req.body;

  if (mail === '' || password === '') {
    return res.status(400).json({ error: 'Enter required details' });
  }
  try {
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `User doesn't exist` });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res
        .status(200)
        .json({ success: true, message: 'User logged in successfully' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
