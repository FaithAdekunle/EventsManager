import { body, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import database from '../db';
import Help from './helpers';

dotenv.config({ path: '.env' });

module.exports = class userController {
/**
 * provides validation for incoming request body for user signup
 * @returns { array } an array of functions to parse request
 */
  static userValidations() {
    return [
      body('fullName')
        .exists()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('fullName must be 1 - 30 characters'),
      body('password')
        .exists()
        .isLength({ min: 8, max: 100 })
        .withMessage('password must be 8 - 100 characters'),
      body('confirmPassword')
        .exists()
        .withMessage('missing password confirm'),
      body('email')
        .exists()
        .trim()
        .isLength({ min: 1, max: 50 })
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
        .exists()
        .withMessage('invalid email')
        .normalizeEmail({ all_lowercase: true }),
      body('password')
        .exists()
        .withMessage('invalid password'),
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
    if (validationResult(req).isEmpty()) {
      return next();
    }
    let response = [];
    const errors = validationResult(req).array();
    errors.map((error) => {
      if (error.msg !== 'Invalid value') response.push(error.msg);
      return null;
    });
    if (response.length === 1) [response] = response;
    return res.status(400).json(Help.getResponse(response));
  }

  /**
   * hashes or encrypts incoming user password
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { fucntion } next()
   */
  static hashPassword(req, res, next) {
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json(Help.getResponse('password and confirmPassword fields are not equal'));
    }
    const saltRounds = 10;
    return bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
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
  static sanitizeParams(req, res, next) {
    if (req.params.id) {
      req.params.id = parseInt(req.params.id, 10);
      if (!Number.isInteger(req.params.id)) return res.status(400).json(Help.getResponse('invalid id parameter'));
    }
    if (req.params.centerId) {
      req.params.centerId = parseInt(req.params.centerId, 10);
      if (!Number.isInteger(req.params.centerId)) return res.status(400).json(Help.getResponse('invalid centerId parameter'));
    }
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
    if (!token) return res.status(400).json(Help.getResponse('missing token'));
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) return res.status(401).json(Help.getResponse('token has expired'));
      return database.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) return res.status(404).json(Help.getResponse('user not found'));
          req.body.userId = user.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json(Help.getResponse('authentication failed'));
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
    if (!token) return res.status(400).json(Help.getResponse('missing token'));
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) return res.status(401).json(Help.getResponse('token has expired'));
      return database.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).json(Help.getResponse('admin not found'));
          }
          if (!user.isAdmin) return res.status(401).json(Help.getResponse('unauthorized token'));
          req.body.updatedBy = payload.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json(Help.getResponse('authentication failed'));
    }
  }

  /**
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing created user's token or sends error message
 */
  static signUp(req, res) {
    database.user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) return res.status(409).json(Help.getResponse('a user already exits with this email'));
        const newUser = {
          fullName: req.body.fullName,
          email: req.body.email,
          password: req.body.password,
          isAdmin: false,
        };
        return database.user.create(newUser)
          .then((createdUser) => {
            const token = userController.generateToken(createdUser);
            return res.status(201).json(Help.getResponse(token, 'token', true));
          })
          .catch(() => {
            res.status(500).json(Help.getResponse('Internal server error'));
          });
      })
      .catch(() => {
        res.status(500).json(Help.getResponse('Internal server error'));
      });
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
          return res.status(400).json(Help.getResponse('email and password combination invalid'));
        }
        return bcrypt.compare(req.body.password, user.password, (error, response) => {
          if (!response) return res.status(400).json(Help.getResponse('email and password combination invalid'));
          const token = userController.generateToken(user);
          return res.json(Help.getResponse(token, 'token', true));
        });
      });
  }
};
