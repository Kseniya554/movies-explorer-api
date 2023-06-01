const jwt = require('jsonwebtoken');

// const SECRET_KEY = 'SECRET';
const { NODE_ENV, JWT_SECRET } = process.env;
// const JWT_SECRET_KEY = 'very_secret';

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
// { _id: user._id },
// NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
// { expiresIn: '7d' },
// );

module.exports = { generateToken };
