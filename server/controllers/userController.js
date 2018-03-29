import { body, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import database from '../db';

dotenv.config({ path: '.env' });

module.exports = class userController {
/**
 * provides validation for incoming request body for user signup
 * @returns { array } an array of functions to parse request
 */
  static userValidations() {
    return [
      body('fullName')
        .exists().withMessage('fullName field missing')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('fullName must be between 1 and 100 characters long'),
      body('password')
        .exists().withMessage('password field missing')
        .trim()
        .isLength({ min: 8, max: 100 })
        .withMessage('password must be between 8 and 100 characters long'),
      body('confirmPassword')
        .exists().withMessage('confirmPassword field missing')
        .trim(),
      body('email')
        .exists().withMessage('email field missing')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('email must be between 1 and 100 characters long')
        .isEmail()
        .withMessage('invalid email')
        .normalizeEmail({ all_lowercase: true }),
    ];
  }

  /**
 * provides validation for incoming request body for user signin
 * @returns { array } an array of functions to parse request
 */
  static signInValidations() {
    return [
      body('email')
        .exists().withMessage('email field missing')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('email must be between 1 and 100 characters long')
        .isEmail()
        .withMessage('invalid email')
        .normalizeEmail({ all_lowercase: true }),
      body('password')
        .exists().withMessage('password field missing')
        .trim()
        .isLength({ min: 8, max: 100 })
        .withMessage('password must be between 8 and 100 characters long'),
    ];
  }

  /**
   * checks if there are any failed validations
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object | function} next() if validations pass or sends error object otherwise
 */
  static checkFailedValidations(req, res, next) {
    const response = [];
    if (req.body.confirmPassword
      && req.body.password !== req.body.confirmPassword) response.push('password and confirmPassword fields are not equal');
    if (validationResult(req).isEmpty()) {
      if (response.length > 0) return res.status(400).json({ err: response });
      return next();
    }
    const errors = validationResult(req).array();
    errors.map(error => response.push(error.msg));
    return res.status(400).json({ err: response });
  }

  /**
   * hashes or encrypts incoming user password
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { fucntion } next()
   */
  static hashPassword(req, res, next) {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      req.body.password = hash;
      return next();
    });
  }

  /**
 * generates a token using a secret key and user details
 * @param {object} user
 * @returns { string } user token
 */
  static generateToken(user) {
    const token = jwt.sign({
      id: user.id,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      expires: Date.now() + (user.isAdmin ? 43200000 : 604800000),
    }, process.env.SECRET);
    return token;
  }

  /**
 * converts incoming user's fullname and email to lowercase
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { function } calls next middleware
 */
  static toLowerCase(req, res, next) {
    if (req.body.fullName) req.body.fullName = req.body.fullName.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    return next();
  }

  /**
 * ensures incoming id in url is valid
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { function | object } next() if id parameter in url is
 * valid or sends error reaponse otherwise
 */
  static sanitizeId(req, res, next) {
    req.params.id = parseInt(req.params.id, 10);
    if (!Number.isInteger(req.params.id)) return res.status(400).json({ err: 'invalid id parameter' });
    return next();
  }

  /**
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { function | object } next() if token is valid or sends err object otherwise
 */
  static verifyUserToken(req, res, next) {
    const { token } = req.query;
    if (!token) return res.status(400).json({ err: 'missing token' });
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) return res.status(401).json({ err: 'token has expired' });
      return database.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) return res.status(404).json({ err: 'user not found' });
          req.body.userId = user.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json({ err: 'authentication failed' });
    }
  }

  /**
 * verifies admin token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { function | object } next() if token is valid or sends err object otherwise
 */
  static verifyAdmin(req, res, next) {
    const { token } = req.query;
    if (!token) {
      return res.status(401).json({ err: 'no token found' });
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) return res.status(401).json({ err: 'token has expired' });
      return database.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ err: 'admin not found' });
          }
          if (!user.isAdmin) return res.status(401).json({ err: 'unauthorized token' });
          req.body.updatedBy = payload.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json({ err: 'authentication failed' });
    }
  }

  /**
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing created user's token or sends error message
 */
  static signUp(req, res) {
    database.user.create(req.body)
      .then((createdUser) => {
        const user = {
          token: userController.generateToken(createdUser),
        };
        return res.status(201).json(user);
      })
      .catch(err => res.status(400).json({ err: err.errors[0].none || 'a user already exits with this email' }));
  }

  /**
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing signed in user's token or sends error message
 */
  static signIn(req, res) {
    database.user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ err: 'email and password combination invalid' });
        }
        return bcrypt.compare(req.body.password, user.password, (error, response) => {
          if (!response) return res.status(400).json({ err: 'email and password combination invalid' });
          const userDone = {
            token: userController.generateToken(user),
          };
          return res.json(userDone);
        });
      });
  }
};
