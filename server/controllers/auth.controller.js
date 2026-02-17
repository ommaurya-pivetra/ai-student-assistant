const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, password, and username are required' }
        });
      }

      const normalizedUsername = username.trim();

      if (!normalizedUsername) {
        return res.status(400).json({
          success: false,
          error: { message: 'Username is required' }
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Please provide a valid email' }
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: { message: 'Password must be at least 6 characters' }
        });
      }

      const normalizedEmail = normalizeEmail(email);
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { message: 'Email already in use' }
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash
      });

      const token = createToken(user.id);

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email and password are required' }
        });
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid email or password' }
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid email or password' }
        });
      }

      const token = createToken(user.id);

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('username email createdAt');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
