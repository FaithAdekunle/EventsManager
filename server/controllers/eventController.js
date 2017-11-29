import moment from 'moment';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import database from '../db';
import { unmountImages, jsonHandle } from './centerController';

module.exports = class EventController {
  // validate incoming body fields for /events requests
  static eventValidations() {
    return [
      body('name')
        .exists()
        .withMessage('missing event name field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty event name not allowed'),
      body('type')
        .exists()
        .withMessage('missing event type field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty event type not allowed'),
      body('centerId')
        .exists()
        .withMessage('missing center id field'),
      body('images')
        .exists()
        .withMessage('no event image found'),
      body('guests')
        .exists()
        .withMessage('missing center id field'),
      body('days')
        .exists()
        .withMessage('missing center id field'),
      body('start')
        .exists()
        .withMessage('missing event start date field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty event start date not allowed'),
      sanitize('days').toInt(),
      sanitize('guests').toInt(),
      sanitize('centerId').toInt(),
    ];
  }

  // check if any of the above validations failed
  static checkFailedValidations(req, res, next) {
    if (validationResult(req).isEmpty()) return next();
    unmountImages(req.body);
    const errors = validationResult(req).array();
    return res.json({ err: errors[0].msg });
  }

  // use moment.js to validate the start date field as correct date format and
  // also not a previous or current date
  static checkAndSanitizeDateFields(req, res, next) {
    if (!moment(req.body.start, 'DD-MM-YYYY').isValid()
      || !(moment(req.body.start, 'DD-MM-YYYY').isAfter(moment()))) {
      unmountImages(req.body);
      return res.json({ err: 'Invalid details. Use format DD/MM/YYYY for date' });
    }
    req.body.start = moment(req.body.start, 'DD-MM-YYYY').format('DD MM YYYY').split(' ').join('/');
    req.body.end = moment(req.body.start, 'DD-MM-YYYY').add(req.body.days - 1, 'days').format('DD MM YYYY').split(' ')
      .join('/');
    return next();
  }

  // validate the days and guests field as actual non signed integers
  static checkDaysAndGuestsFields(req, res, next) {
    if (!Number.isInteger(req.body.days)
      || !Number.isInteger(req.body.guests)
      || !Number.isInteger(req.body.centerId)
      || [-1, 0, -0].includes(Math.sign(req.body.days))
      || [-1, 0, -0].includes(Math.sign(req.body.centerId))
      || [-1, 0, -0].includes(Math.sign(req.body.guests))) {
      unmountImages(req.body);
      return res.json({ err: 'Invalid details. Only positive integers allowed' });
    }
    return next();
  }

  static createEvent(req, res) {
    jsonHandle(req.body, false);
    database.event.create(req.body)
      .then(createdEvent => {
        jsonHandle(createdEvent);
        res.json(createdEvent);
      })
      .catch((err) => {
        jsonHandle(req.body);
        unmountImages(req.body);
        res.json({ err: 'problem occured creating event' });
      });
  }

  static modifyEvent(req, res) {
    database.event.findOne({
      where: {
        id: req.params.id,
        userId: req.body.userId,
      },
    })
      .then((event) => {
        if (!event) {
          unmountImages(req.body);
          return res.json({ err: 'event not found' });
        }
        jsonHandle(event);
        unmountImages(event);
        jsonHandle(req.body, false);
        return database.event.update(req.body, {
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
        })
          .then((rows) => {
            if (rows[0] > 0) {
              return database.event.findOne({
                where: {
                  id: req.params.id,
                  userId: req.body.userId,
                },
              })
                .then((updatedEvent) => {
                  jsonHandle(updatedEvent);
                  res.json(updatedEvent);
                });
            }
            jsonHandle(req.body);
            unmountImages(req.body);
            return res.json({ err: 'problem occured editing event' });
          })
          .catch((err) => {
            jsonHandle(req.body);
            unmountImages(req.body);
            return res.json({ err: 'problem occured editing event' });
          });
      })
      .catch((err) => {
        unmountImages(req.body);
        return res.json({ err: 'problem occured editing event' });
      });
  }

  static deleteEvent(req, res) {
    database.event.findOne({
      where: {
        id: req.params.id,
        userId: req.body.userId,
      },
    })
      .then((event) => {
        if (!event) return res.json({ err: 'event not found' });
        jsonHandle(event);
        unmountImages(event);
        return database.event.destroy({
          where: {
            id: req.params.id,
            userId: req.body.userId,
          },
        })
          .then((num) => {
            if (num > 0) return res.json({ status: 'success' });
            return res.json({ err: 'event not found' });
          })
          .catch(err => res.json({ err: 'problem occured deleting event' }));
      })
      .catch(err => res.json({ err: 'problem occured deleting event' }));
  }

  static fetchUserEvents(req, res) {
    database.event.findAll({
      where: {
        userId: req.body.userId,
      },
    })
      .then((events) => {
        events.map((event) => {
          jsonHandle(event);
        });
        return res.json(events);
      })
      .catch(err => res.json({ err: 'problem occured fetching user events' }));
  }

  static declineEvent(req, res) {
    if (!req.body.isAdmin) return res.json({ err: 'unauthorized request' });
    database.event.update({ isValid: false }, {
      where: {
        id: req.params.id,
      },
    })
      .then((row) => {
        if (row > 0) return res.json({ status: 'success' });
        return res.json({ err: 'event not found' });
      })
      .catch(err => res.json({ err: 'problem occured declining event' }));
  }
};

