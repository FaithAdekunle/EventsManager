import moment from 'moment';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import database from '../db';

dotenv.config({ path: '.env' });

// set up transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = class EventController {
/**
 * provides validation for incoming request body for creating/editing event
 * @returns { array } an array of functions to parse request
 */
  static eventValidations() {
    return [
      body('name')
        .exists()
        .withMessage('missing event name field')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('event name must be between 1 and 100 characters long'),
      body('type')
        .exists()
        .withMessage('missing event type field')
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage('event type must be between 1 and 20 characters long'),
      body('centerId')
        .exists()
        .withMessage('missing center id field'),
      body('guests')
        .exists()
        .withMessage('missing guests field'),
      body('days')
        .exists()
        .withMessage('missing days field'),
      body('start')
        .exists()
        .withMessage('missing event start date field')
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('event start date must be between 1 and 10 characters long'),
      sanitize('days').toInt(),
      sanitize('guests').toInt(),
      sanitize('centerId').toInt(),
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
    if (validationResult(req).isEmpty()) return next();
    const errors = validationResult(req).array();
    const response = [];
    errors.map(error => response.push(error.msg));
    return res.status(400).json({ err: response });
  }

  /**
   * checks if there are any failed validations
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object | function} next() if validations pass or sends error object otherwise
 */
  static checkAndSanitizeDateFields(req, res, next) {
    if (!moment(req.body.start, 'DD-MM-YYYY').isValid()) return res.status(400).json({ err: 'Invalid date. Use format DD/MM/YYYY for date' });
    if (!(moment(req.body.start, 'DD-MM-YYYY').isAfter(moment()))) return res.status(400).json({ err: 'Pevious dates can not be booked' });
    req.body.start = moment(req.body.start, 'DD-MM-YYYY').format('DD MM YYYY').split(' ').join('/');
    req.body.end = moment(req.body.start, 'DD-MM-YYYY').add(req.body.days - 1, 'days').format('DD MM YYYY').split(' ')
      .join('/');
    return next();
  }

  /**
   * checks that days and guest fields are valid
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns { object | function } next() if validations pass or sends error object otherwise
 */
  static checkDaysAndGuestsFields(req, res, next) {
    if (!Number.isInteger(req.body.days)
      || !Number.isInteger(req.body.guests)
      || !Number.isInteger(req.body.centerId)
      || [-1, 0, -0].includes(Math.sign(req.body.days))
      || Math.sign(req.body.centerId) === -1
      || [-1, 0, -0].includes(Math.sign(req.body.guests))) {
      return res.status(400).json({ err: 'Invalid details. Only positive integers allowed for centerId, guests and days fields' });
    }
    return next();
  }

  /**
 * creates new event
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing created event or sends error message
 */
  static createEvent(req, res) {
    database.event.create(req.body)
      .then((createdEvent) => {
        res.status(201).json(createdEvent);
      })
      .catch(() => {
        res.status(500).json({ err: 'Internal server error' });
      });
  }

  /**
 * modifies existing event
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing modified event or sends error message
 */
  static modifyEvent(req, res) {
    database.event.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.body.userId,
      },
    })
      .then((rows) => {
        if (rows[0] === 0) return res.status(404).json({ err: 'event not found' });
        return database.event.findOne({
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
        })
          .then((updatedEvent) => {
            res.json(updatedEvent);
          })
          .catch(() => res.status(500).json({ err: 'Internal server error' }));
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }

  /**
 * deletes existing event
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing delete success message or error message
 */
  static deleteEvent(req, res) {
    database.event.findOne({
      where: {
        id: req.params.id,
        userId: req.body.userId,
      },
    })
      .then((event) => {
        if (!event) return res.status(404).json({ err: 'event not found' });
        return database.event.destroy({
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
        })
          .then(() => {
            return res.json({ status: 'success' });
          })
          .catch(() => res.status(500).json({ err: 'Internal server error' }));
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }

  /**
 * fetches existing events
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing all user's event or fetch error message
 */
  static fetchUserEvents(req, res) {
    database.event.findAll({
      where: {
        userId: req.body.userId,
      },
    })
      .then((events) => {
        return res.json(events);
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }

  /**
 * declines existing event
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { object } object containing modified event or sends error message
 */
  static declineUserEvent(req, res, next) {
    database.event.update({ isAccepted: false }, {
      where: {
        id: req.params.id,
      },
    })
      .then((rows) => {
        if (rows[0] === 0) return res.status(404).json({ err: 'event not found' });
        return next();
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }

  /**
 * sends mail to user
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing success message or sends error message
 */
  static sendMail(req, res) {
    database.event.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((event) => {
        return database.user.findOne({
          where: {
            id: event.userId,
          },
        })
          .then((user) => {
            const mailOptions = {
              from: process.env.EMAIL,
              subject: 'Event Decline',
              to: user.email,
              html: `<p>Dear user, we are very sorry to inform you that your event titled <strong>${event.name}</strong> slated between ${event.start} and ${event.end} has been declined due to internal reasons</p>. 
                    <p>Appropriate refunds will be made. Do bare with us please.</p>
                    <p>Thanks. Admin.</p>`,
            };
            return transporter.sendMail(mailOptions, (error, info) => {
              if (error) return res.status(404).json({ err: 'event declined, error occured sending mail to user' });
              return res.json({
                status: 'success',
                msg: `event declined successful and user notified in mail ${info.messageId}`,
              });
            });
          })
          .catch(() => res.status(500).json({ err: 'internal server error' }));
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }
};

