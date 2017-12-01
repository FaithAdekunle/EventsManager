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

  // check if any of the above validations failed
  static checkFailedValidations(req, res, next) {
    if (validationResult(req).isEmpty()) return next();
    unmountImages(req.body);
    const errors = validationResult(req).array();
    const response = [];
    errors.map(error => response.push(error.msg));
    return res.status(400).json({ err: response });
  }

  // use moment.js to validate the start date field as correct date format and
  // also not a previous or current date
  static checkAndSanitizeDateFields(req, res, next) {
    if (!moment(req.body.start, 'DD-MM-YYYY').isValid()
      || !(moment(req.body.start, 'DD-MM-YYYY').isAfter(moment()))) {
      unmountImages(req.body);
      return res.status(400).json({ err: 'Invalid date. Use format DD/MM/YYYY for date' });
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
      return res.status(400).json({ err: 'Invalid details. Only positive integers allowed for centerId, guests and days fields' });
    }
    return next();
  }

  // createEvent(req, res) creates a new user event
  static createEvent(req, res) {
    jsonHandle(req.body, false);
    database.event.create(req.body)
      .then((createdEvent) => {
        jsonHandle(createdEvent);
        res.json(createdEvent);
      })
      .catch((err) => {
        jsonHandle(req.body);
        unmountImages(req.body);
        res.status(500).json({ err: err.message || 'problem occured creating event' });
      });
  }

  // modifyEvent(req, res) modifies an existing user event
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
          return res.status(404).json({ err: 'event not found' });
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
                })
                .catch((err) => {
                  jsonHandle(req.body);
                  unmountImages(req.body);
                  return res.status(404).json({ err: err.message || 'problem occured editing event' });
                });
            }
            jsonHandle(req.body);
            unmountImages(req.body);
            return res.status(404).json({ err: 'problem occured editing event' });
          })
          .catch((err) => {
            jsonHandle(req.body);
            unmountImages(req.body);
            return res.status(404).json({ err: err.message || 'problem occured editing event' });
          });
      })
      .catch((err) => {
        unmountImages(req.body);
        return res.status(404).json({ err: err.message || 'problem occured editing event' });
      });
  }

  // deleteEvent(req, res) deletes an existing user event
  static deleteEvent(req, res) {
    database.event.findOne({
      where: {
        id: req.params.id,
        userId: req.body.userId,
      },
    })
      .then((event) => {
        if (!event) return res.status(404).json({ err: 'event not found' });
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
            return res.status(404).json({ err: 'event not found' });
          })
          .catch(err => res.status(404).json({ err: err.message || 'problem occured deleting event' }));
      })
      .catch(err => res.status(404).json({ err: err.message || 'problem occured deleting event' }));
  }

  // fetchEvent(req, res) fetches all events belonging to user
  static fetchUserEvents(req, res) {
    database.event.findAll({
      where: {
        userId: req.body.userId,
      },
    })
      .then((events) => {
        events.map(event => jsonHandle(event));
        return res.json(events);
      })
      .catch(err => res.status(404).json({ err: err.message || 'problem occured fetching user events' }));
  }
};

