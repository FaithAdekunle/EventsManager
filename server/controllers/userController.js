import { body, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import database from '../db';
import { unmountImages } from '../controllers/centerController';

dotenv.config({ path: '.env' });

module.exports = class userController {
  // validate incoming body fields for /events requests
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

  // validate incoming body fields for /events/login requests
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

  // check if any of the above validations failed
  static checkFailedValidations(req, res, next) {
    const response = [];
    if (validationResult(req).isEmpty()) {
      if (req.body.confirmPassword
        && req.body.password !== req.body.confirmPassword) {
        response.push('password and confirmPassowrd field are not equal');
        return res.status(400).json({ err: response });
      }
      return next();
    }
    const errors = validationResult(req).array();
    errors.map(error => response.push(error.msg));
    if (req.body.confirmPassword
      && req.body.password !== req.body.confirmPassword) response.push('password and confirmPassowrd fields are not equal');
    return res.status(400).json({ err: response });
  }

  // hashPassword(req, res) hashes the incoming password
  static hashPassword(req, res, next) {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (hash) {
        req.body.password = hash;
        next();
      }
      if (err) res.json({ err: 'password hash failed' });
    });
  }

  // generateToken(user) generates a token using user properties
  static generateToken(user) {
    const token = jwt.sign({
      id: user.id,
      fulName: user.fullName,
      expires: Date.now() + 600000,
    }, process.env.SECRET);
    return token;
  }

  // toLowerCase(req, res, next) converts fullName and email fields to lower case
  static toLowerCase(req, res, next) {
    if (req.body.fullName) req.body.fullName = req.body.fullName.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    return next();
  }

  // sanitizeId(req, res, next) sanitizes id path parameter in req.params
  static sanitizeId(req, res, next) {
    req.params.id = parseInt(req.params.id, 10);
    if (!Number.isInteger(req.params.id)) return res.status(400).json({ err: 'invalid id parameter' });
    return next();
  }

  // verifyUserToken(req, res, next) verifies token sent with user req
  static verifyUserToken(req, res, next) {
    const { token } = req.query;
    if (!token) return res.json({ err: 'missing token' });
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
            return res.status(404).json({ err: 'user not found' });
          }
          req.body.userId = user.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json({ err: 'authentication failed' });
    }
  }

  // verifyUserToken(req, res, next) verifies token sent with admin req
  static verifyAdmin(req, res, next) {
    const { token } = req.query;
    if (!token) {
      unmountImages(req.body);
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
      unmountImages(req.body);
      return res.status(401).json({ err: 'authentication failed' });
    }
  }

  // signUp(req, res, next) creates a new user account
  static signUp(req, res) {
    database.user.create(req.body)
      .then((createdUser) => {
        const user = {
          fullName: createdUser.fullName,
          email: createdUser.email,
          id: createdUser.id,
          isAdmin: createdUser.isAdmin,
          token: userController.generateToken(createdUser),
        };
        return res.status(201).json(user);
      })
      .catch(err => res.status(400).json({ err: err.errors[0].none || 'a user already exits with this email' }));
  }

  // signUp(req, res, next) logs an existing user in.
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
            fullName: user.fullName,
            email: user.email,
            id: user.id,
            isAdmin: user.isAdmin,
            token: userController.generateToken(user),
          };
          return res.json(userDone);
        });
      });
  }
};
