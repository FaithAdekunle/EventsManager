import moment from 'moment';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import database from '../db';
import Help from './helpers';

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
  * provides validation for incoming start and end dates
  * @param { integer } value
  * @param { string } field
  * @returns { void }
  */
  static validateDateField(value, field) {
    if (!moment(value, 'DD-MM-YYYY').isValid()) {
      throw new Error(`Invalid ${field} date. Use format DD/MM/YYYY.`);
    }
    if (!(moment(value, 'DD-MM-YYYY').isAfter(moment()))) throw new Error(`${field} date is past`);
  }

/**
 * provides validation for incoming request body for creating/editing event
 * @returns { array } an array of functions to parse request
 */
  static eventValidations() {
    return [
      body('name')
        .exists()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('name must be 1 - 30 characters'),
      body('type')
        .exists()
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage('type must be between 1 - 20 characters'),
      body('start')
        .custom((value) => {
          EventController.validateDateField(value, 'start');
        }),
      body('end')
        .custom((value) => {
          EventController.validateDateField(value, 'end');
        }),
      sanitize('centerId').toInt(),
      body('centerId')
        .custom((value) => {
          if (!Number.isInteger(value) || Math.sign(value) === -1) {
            throw new Error('invalid centerId value');
          }
        }),
      sanitize('guests').toInt(),
      body('guests')
        .custom(value => Help.sanitizeInteger(value, 'guests')),
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
    let response = [];
    errors.map((error) => {
      if (error.msg !== 'Invalid value') response.push(error.msg);
      return null;
    });
    if (response.length === 0) return next();
    if (response.length === 1) [response] = response;
    return res.status(400).json(Help.getResponse(response));
  }

  /**
   * checks if there are any failed validations
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object | function} next() if validations pass or sends error object otherwise
 */
  static checkAndSanitizeDateFields(req, res, next) {
    if ((moment(req.body.start, 'DD-MM-YYYY').isAfter(moment(req.body.end, 'DD-MM-YYYY')))) {
      return res.status(400).json(Help.getResponse('start date cannot be ahead of end date'))
    }
    ['start', 'end'].map((date) => {
      req.body[date] = moment(req.body[date], 'DD-MM-YYYY').format('DD MM YYYY').split(' ').join('/');
    })
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
        res.status(201).json(Help.getResponse(createdEvent, 'event', true));
      })
      .catch(() => {
        res.status(500).json(Help.getResponse('Internal server error'));
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
        if (rows[0] === 0) return res.status(404).json(Help.getResponse('event not found'));
        return database.event.findOne({
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
          include: [{
            model: database.center,
            attributes: ['name', 'capacity'],
          }],
        })
          .then((updatedEvent) => {
            res.json(Help.getResponse(updatedEvent, 'event', true));
          })
          .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
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
        if (!event) return res.status(404).json(Help.getResponse('event not found'));
        return database.event.destroy({
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
        })
          .then(() => {
            return res.json(Help.getResponse(req.params.id, 'deteted', true));
          })
          .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
  }

  /**
 * filters events based on query properties
 * @param {object} events
 * @param {object} res
 * @returns { object } object containing all user's event or fetch error message
 */
  static filterEvents(events, req) {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10);
    const { upcoming } = req.query;
    let upcomingEvents = null;
    if (upcoming === 'true') {
      upcomingEvents = events.filter((event) => {
        return moment(event.end, 'DD-MM-YYYY').isSameOrAfter(moment());
      })
    } else {
      upcomingEvents = events;
    }
    if (offset) upcomingEvents = upcomingEvents.slice(offset);
    if (limit) upcomingEvents = upcomingEvents.slice(0, limit);
    return upcomingEvents;
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
      include: [{
        model: database.center,
        attributes: ['name', 'capacity'],
      }],
    })
      .then((events) => {
        return res.json(
          Help.getResponse(EventController.filterEvents(events, req),
          'events',
          true,
        ));
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
  }

  /**
 * fetches existing events
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing all user's event or fetch error message
 */
static fetchCenterEvents(req, res) {
  database.center.findOne({
    where: {
      id: req.params.centerId,
    }
  })
    .then((center) => {
      if (!center) return res.status(404).json(Help.getResponse('center not found'));
      database.event.findAll({
        where: {
          centerId: req.params.centerId,
        }
      })
        .then((events) => {
          return res.json(
            Help.getResponse(EventController.filterEvents(events, req),
            'events',
            true,
          ));
        })
        .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
    })
    .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
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
        if (rows[0] === 0) return res.status(404).json(Help.getResponse('event not found'));
        return next();
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
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
            return transporter.sendMail(mailOptions, (error) => {
              if (error) return res.status(404).json(Help.getResponse('event declined, error occured sending mail to user'));
              return res.json(Help.getResponse(req.params.id, 'declined', true));
            });
          })
          .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
  }
};

