import moment from 'moment';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { Op } from 'sequelize';
import database from '../db';

export const jsonHandle = (obj, parse = true) => {
  if (parse) {
    if (obj.images) obj.images = JSON.parse(obj.images);
    if (obj.facilities) obj.facilities = JSON.parse(obj.facilities);
  } else {
    if (obj.images) obj.images = JSON.stringify(obj.images);
    if (obj.facilities) obj.facilities = JSON.stringify(obj.facilities);
  }
};

/** CenterController class defines static
    methods to be used in handling /centers
    routes */
export class CenterController {
/**
 * provides validation for incoming request body for creating/editing centers
 * @returns { array } an array of functions to parse request
 */
  static centerValidations() {
    return [
      body('name')
        .exists()
        .withMessage('missing center name field')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('center name must be between 1 and 100 characters long'),
      body('description')
        .exists()
        .withMessage('missing center description field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty center description not allowed'),
      body('facilities')
        .exists()
        .withMessage('missing center facilities field')
        .trim()
        .isLength({ min: 1, max: 300 })
        .withMessage('center facilities must be between 1 and 300 characters long'),
      body('address')
        .exists()
        .withMessage('missing center address field')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('center address must be between 1 and 100 characters long'),
      body('capacity')
        .exists()
        .withMessage('missing center capacity field'),
      body('cost')
        .exists()
        .withMessage('missing center cost field'),
      body('images')
        .exists()
        .withMessage('missing images field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty images field'),
      sanitize('capacity').toInt(),
      sanitize('cost').toInt(),
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
    if (validationResult(req).isEmpty()) {
      return next();
    }
    const errors = validationResult(req).array();
    errors.map(error => response.push(error.msg));
    return res.status(400).json({ err: response });
  }

  /**
   * splits center facilities into an array
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {function} next()
 */
  static splitFacilitiesAndImages(req, res, next) {
    const facilities = [];
    const images = [];
    req.body.facilities.split(',').map(facility => facilities.push(facility.trim()));
    req.body.images.split(',').map(image => images.push(image.trim()));
    req.body.facilities = facilities;
    req.body.images = images;
    return next();
  }

  /**
   * checks that cost and capacity fields are valid
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns { object | function } next() if validations pass or sends error object otherwise
 */
  static checkCostAndCapacityFields(req, res, next) {
    if (!Number.isInteger(req.body.cost)
      || !Number.isInteger(req.body.capacity)
      || [-1, 0, -0].includes(Math.sign(req.body.cost))
      || [-1, 0, -0].includes(Math.sign(req.body.capacity))) {
      return res.status(400).json({ err: 'Invalid details. Only positive integers allowed for cost and capacity fields' });
    }
    return next();
  }

  /**
 * creates new ecenter
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing created center or sends error message
 */
  static addCenter(req, res) {
    req.body.createdBy = req.body.updatedBy;
    jsonHandle(req.body, false);
    database.center.create(req.body)
      .then((createdCenter) => {
        jsonHandle(createdCenter);
        res.status(201).json(createdCenter);
      })
      .catch(() => {
        res.status(400).json({ err: 'center name already exists' });
      });
  }

  /**
 * modifies existing center
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing modified center or sends error message
 */
  static modifyCenter(req, res) {
    database.center.findOne({
      where: {
        name: req.body.name,
        id: {
          [Op.ne]: req.params.id,
        },
      },
    })
      .then((centerCheck) => {
        if (!centerCheck) {
          jsonHandle(req.body, false);
          return database.center.update(req.body, {
            where: {
              id: req.params.id,
            },
          })
            .then((rows) => {
              if (rows[0] === 0) return res.status(404).json({ err: 'center not found' });
              return database.center.findOne({
                where: {
                  id: req.params.id,
                },
                include: [
                  { model: database.event },
                ],
              })
                .then((updatedCenter) => {
                  jsonHandle(updatedCenter);
                  return res.json(updatedCenter);
                });
            })
            .catch(() => res.status(500).json({ err: 'Internal server error' }));
        }
        return res.status(409).json({ err: 'center name already exists' });
      })
      .catch(() => res.status(500).json({ err: 'Internal server error' }));
  }

  /**
 * fetches existing centers
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing all centers or fetch error message
 */
  static fetchCenters(req, res) {
    return database.center.findAll({
      include: [
        { model: database.event },
      ],
    })
      .then((centers) => {
        centers.map((center) => {
          return jsonHandle(center);
        });
        return res.json(centers);
      });
  }

  /**
 * fetches existing events
 * @param {object} req
 * @param {object} res
 * @returns { object } fetched center or fetch error message
 */
  static fetchCenter(req, res) {
    database.center.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: database.event,
      }],
    })
      .then((center) => {
        if (!center) return res.status(404).json({ err: 'center not found' });
        jsonHandle(center);
        return res.send(center);
      });
  }

  /**
 * checks if a center is available to be booked and if there is any booking date conflict
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { object | function } next() or object containing error message
 */
  static checkAvailability(req, res, next) {
    database.center.findOne({
      where: {
        id: req.body.centerId,
      },
      include: [{
        model: database.event,
      }],
    })
      .then((center) => {
        if (!center) return res.status(404).json({ err: 'center not found' });
        center.events.map((event) => {
          if (event.id === req.params.id) return null;
          const { start, end } = event;
          if (moment(req.body.start, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(req.body.end, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(start, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')
           || moment(end, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')) {
            return res.status(409).json({ err: 'dates have been booked' });
          }
          return null;
        });
        return next();
      });
  }
}

