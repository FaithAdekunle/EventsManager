import moment from 'moment';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { body } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import db from '../db';
import Helpers from '../Helpers';

dotenv.config({ path: '.env' });

/**
 * class for event controllers
 */
class EventController {
  static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  /**
   * checks is date is today's date
   * @param { integer } date
   * @returns { boolean } isToday
   */
  static isToday(date) {
    const isThisDay = moment(date, 'DD-MM-YYYY')
      .date() === new Date().getDate();
    const isThisMonth = moment(date, 'DD-MM-YYYY')
      .month() === new Date().getMonth();
    const isThisYear = moment(date, 'DD-MM-YYYY')
      .year() === new Date().getFullYear();
    const isToday = isThisDay && isThisMonth && isThisYear;
    return isToday;
  }

  /**
   * provides validation for incoming start and end dates
   * @param { integer } value
   * @param { string } field
   * @returns { void }
   */
  static validateDateField(value, field) {
    const isToday = EventController.isToday(value);
    if (!moment(value, 'DD-MM-YYYY').isValid()) {
      throw new Error(`Invalid ${field} date. Use format DD/MM/YYYY.`);
    }
    if (!(isToday || moment(value, 'DD-MM-YYYY').isAfter(moment()))) {
      throw new Error(`${field} date is past`);
    }
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
      body('start').custom((value) => {
        EventController.validateDateField(value, 'start');
      }),
      body('end').custom((value) => {
        EventController.validateDateField(value, 'end');
      }),
      sanitize('centerId').toInt(),
      body('centerId').custom((value) => {
        if (!Number.isInteger(value) || Math.sign(value) === -1) {
          throw new Error('invalid centerId value');
        }
      }),
      sanitize('guests').toInt(),
      body('guests').custom(value => Helpers.sanitizeInteger(value, 'guests')),
    ];
  }

  /**
   * checks if there are any failed validations
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object | function} next()
   */
  static checkAndSanitizeDateFields(req, res, next) {
    if (
      moment(req.body.start, 'DD-MM-YYYY')
        .isAfter(moment(req.body.end, 'DD-MM-YYYY'))
    ) {
      return res
        .status(400)
        .json(Helpers.getResponse('start date cannot be ahead of end date'));
    }
    ['start', 'end'].map((date) => {
      req.body[date] = moment(req.body[date], 'DD-MM-YYYY')
        .format('DD MM YYYY')
        .split(' ')
        .join('/');
      return null;
    });
    return next();
  }

  /**
   * creates new event
   * @param {object} req
   * @param {object} res
   * @returns { object } event error
   */
  static createEvent(req, res) {
    db.event
      .create(req.body)
      .then((createdEvent) => {
        res.status(201).json(Helpers.getResponse(createdEvent, 'event', true));
      })
      .catch(() => {
        res.status(500).json(Helpers.getResponse('Internal server error'));
      });
  }

  /**
   * modifies existing event
   * @param {object} req
   * @param {object} res
   * @returns { object } event or error
   */
  static modifyEvent(req, res) {
    db.event
      .update(req.body, {
        where: {
          id: req.params.id,
          userId: req.body.userId,
        },
      })
      .then((rows) => {
        if (rows[0] === 0) {
          return res.status(404).json(Helpers.getResponse('event not found'));
        }
        return db.event
          .findOne({
            where: {
              id: req.params.id,
              userId: req.body.userId,
            },
            include: [
              {
                model: db.center,
                attributes: ['name', 'capacity'],
              },
            ],
          })
          .then((updatedEvent) => {
            res.json(Helpers.getResponse(updatedEvent, 'event', true));
          })
          .catch(() =>
            res.status(500).json(Helpers.getResponse('Internal server error')));
      })
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }

  /**
   * deletes existing event
   * @param {object} req
   * @param {object} res
   * @returns { object } success or error message
   */
  static deleteEvent(req, res) {
    db.event
      .findOne({
        where: {
          id: req.params.id,
          userId: req.body.userId,
        },
      })
      .then((event) => {
        if (!event) {
          return res.status(404).json(Helpers.getResponse('event not found'));
        }
        return db.event
          .destroy({
            where: {
              id: req.params.id,
              userId: req.body.userId,
            },
          })
          .then(() =>
            res.json(Helpers.getResponse(req.params.id, 'deleted', true)))
          .catch(() =>
            res.status(500).json(Helpers.getResponse('Internal server error')));
      })
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }

  /**
   * filters events based on query properties
   * @param {object} events
   * @param {object} req
   * @param {object} res
   * @returns { object } events or error
   */
  static filterEvents(events, req, res) {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10) || 0;
    const { upcoming, pagination } = req.query;
    let upcomingEvents = null;
    if (upcoming === 'true') {
      upcomingEvents = events.filter((event) => {
        const isToday = EventController.isToday(event.end);
        return isToday || moment(event.end, 'DD-MM-YYYY').isAfter(moment());
      });
    } else {
      upcomingEvents = events;
    }
    upcomingEvents.sort((event1, event2) => {
      if (moment(event1.start, 'DD-MM-YYYY')
        .isAfter(moment(event2.start, 'DD-MM-YYYY'))) {
        return 1;
      }
      return -1;
    });
    const totalCount = upcomingEvents.length;
    if (offset) upcomingEvents = upcomingEvents.slice(offset);
    if (!Number.isNaN(limit)) upcomingEvents = upcomingEvents.slice(0, limit);
    const response = Helpers.getResponse(upcomingEvents, 'events', true);
    if (pagination === 'true') {
      const metaData = {
        pagination: Helpers.paginationMetadata(
          offset,
          limit,
          totalCount,
          upcomingEvents.length,
        ),
      };
      response.metaData = metaData;
    }
    return res.json(response);
  }

  /**
   * fetches existing events
   * @param {object} req
   * @param {object} res
   * @returns { object } events or error
   */
  static fetchUserEvents(req, res) {
    db.event
      .findAndCountAll({
        where: {
          userId: req.body.userId,
        },
        include: [
          {
            model: db.center,
            attributes: ['name', 'capacity'],
          },
        ],
      })
      .then(result =>
        EventController.filterEvents(result.rows, req, res))
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }

  /**
   * fetches existing events
   * @param {object} req
   * @param {object} res
   * @returns { object } events or error
   */
  static fetchCenterEvents(req, res) {
    db.center
      .findOne({
        where: {
          id: req.params.centerId,
        },
      })
      .then((center) => {
        if (!center) {
          return res.status(404).json(Helpers.getResponse('center not found'));
        }
        return db.event
          .findAndCountAll({
            where: {
              centerId: req.params.centerId,
            },
          })
          .then(result =>
            EventController.filterEvents(result.rows, req, res))
          .catch(() =>
            res.status(500).json(Helpers.getResponse('Internal server error')));
      })
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }

  /**
   * declines existing event
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { object } next or error
   */
  static declineUserEvent(req, res, next) {
    db.event
      .update(
        { isAccepted: false },
        {
          where: {
            id: req.params.id,
          },
        },
      )
      .then((rows) => {
        if (rows[0] === 0) {
          return res.status(404).json(Helpers.getResponse('event not found'));
        }
        return next();
      })
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }

  /**
   * sends mail to user
   * @param {object} req
   * @param {object} res
   * @returns { void }
   */
  static sendMail(req, res) {
    db.event
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then(event =>
        db.user
          .findOne({
            where: {
              id: event.userId,
            },
          })
          .then((user) => {
            const mailOptions = {
              from: process.env.EMAIL,
              subject: 'Event Decline',
              to: user.email,
              html: `<p>Dear user, we are very sorry to inform you that your 
            event titled <strong>${event.name}</strong> slated between 
            ${event.start} and ${event.end} has been declined due to 
            internal reasons</p>.<p>Appropriate refunds will be made. 
            Do bare with us please.</p><p>Thanks. Admin.</p>`,
            };
            EventController.transporter.sendMail(mailOptions, (error) => {
              if (error) {
                return res
                  .status(404)
                  .json(Helpers
                    .getResponse('error occured sending mail to user'));
              }
              return res.json(Helpers
                .getResponse(req.params.id, 'declined', true));
            });
          })
          .catch(() =>
            res.status(500).json(Helpers.getResponse('Internal server error'))))
      .catch(() =>
        res.status(500).json(Helpers.getResponse('Internal server error')));
  }
}

export default EventController;
