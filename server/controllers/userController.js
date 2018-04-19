import { body, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import db from '../db';
import Helpers from '../helpers';

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
 * @returns {object | function} next()
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
    return res.status(400).json(Helpers.getResponse(response));
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
      return res
        .status(400)
        .json(Helpers
          .getResponse('password and confirmPassword fields are not equal'));
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
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing token or error message
 */
  static signUp(req, res) {
    db.user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          return res
            .status(409)
            .json(Helpers
              .getResponse('a user already exits with this email'));
        }
        const newUser = {
          fullName: req.body.fullName,
          email: req.body.email,
          password: req.body.password,
          isAdmin: false,
        };
        return db.user.create(newUser)
          .then((createdUser) => {
            const token = userController.generateToken(createdUser);
            return res.status(201)
              .json(Helpers.getResponse(token, 'token', true));
          })
          .catch(() => {
            res.status(500).json(Helpers.getResponse('Internal server error'));
          });
      })
      .catch(() => {
        res.status(500).json(Helpers.getResponse('Internal server error'));
      });
  }

  /**
 * verifies user token
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing token or error message
 */
  static signIn(req, res) {
    db.user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json(Helpers
              .getResponse('email and password combination invalid'));
        }
        return bcrypt
          .compare(req.body.password, user.password, (error, response) => {
            if (!response) {
              return res
                .status(400)
                .json(Helpers
                  .getResponse('email and password combination invalid'));
            }
            const token = userController.generateToken(user);
            return res.json(Helpers.getResponse(token, 'token', true));
          });
      });
  }
};
