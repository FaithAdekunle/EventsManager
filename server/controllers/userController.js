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
        .isLength({ min: 8, max: 100 })
        .withMessage('password must be between 8 and 100 characters long'),
      body('email')
        .exists().withMessage('email field missing')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('email must be between 1 and 100 characters long')
        .isEmail()
        .withMessage('invalid email')
        .normalizeEmail({ all_lowercase: true }),
      body('phoneNumber')
        .exists().withMessage('phoneNumber field missing')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('phoneNumber must be between 1 and 100 characters long'),
    ];
  }

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
        .isLength({ min: 8, max: 100 })
        .withMessage('password must be between 8 and 100 characters long'),
    ];
  }

  // check if any of the above validations failed
  static checkFailedValidations(req, res, next) {
    if (validationResult(req).isEmpty()) return next();
    const errors = validationResult(req).array();
    return res.status(400).json({ err: errors[0].msg });
  }

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

  static generateToken(user) {
    const token = jwt.sign({
      id: user.id,
      isAdmin: user.isAdmin,
    }, process.env.SECRET);
    return token;
  }

  static verifyUserToken(req, res, next) {
    const { token } = req.query;
    if (!token) return res.json({ err: 'missing token' });
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      req.body.userId = payload.id;
      req.body.isAdmin = payload.isAdmin;
      return next();
    }
    catch (err) {
      return res.json({ err: 'authentication failed' });
    }
  }

  static verifyAdmin(req, res, next) {
    const { token } = req.query;
    if (!token) {
      unmountImages(req.body);
      return res.json({ err: 'no token found' });
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (!payload.isAdmin) {
        unmountImages(req.body);
        return res.json({ err: 'unauthorized operation' });
      }
      req.body.updatedBy = payload.id;
      return next();
    }
    catch (err) {
      unmountImages(req.body);
      return res.json({ err: 'authentication failed' });
    }
  }

  static signUp(req, res) {
    database.user.create(req.body)
      .then(createdUser => res.json({
        token: userController.generateToken(createdUser),
        isAdmin: createdUser.isAdmin,
      }))
      .catch(err => res.status(400).json({ err: err.errors[0].message }));
  }

  static signIn(req, res) {
    database.user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        bcrypt.compare(req.body.password, user.password, (error, response) => {
          if (!response) return res.status(400).json({ err: 'password is incorrect' });
          return res.json({ token: userController.generateToken(user), isAdmin: user.isAdmin });
        });
      })
      .catch(err => res.status(400).json({ err: 'user email not found' }));
  }
};
