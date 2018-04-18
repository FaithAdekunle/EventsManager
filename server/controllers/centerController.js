import moment from 'moment';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { Op } from 'sequelize';
import database from '../db';
import Help from './helpers';

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
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('name must be 1 - 50 characters'),
      body('description')
        .exists()
        .trim()
        .isLength({ min: 1, max: 1200 })
        .withMessage('description must be 1 - 1200 characters'),
      body('facilities')
        .exists()
        .trim()
        .isLength({ min: 1, max: 300 })
        .withMessage('facilities must be 1 - 300 characters'),
      body('address')
        .exists()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('address must be 1 - 50 characters'),
      body('images')
        .exists()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('image(s) invalid'),
      sanitize('cost').toInt(),
      body('cost')
        .custom(value => Help.sanitizeInteger(value, 'cost')),
      sanitize('capacity').toInt(),
      body('capacity')
        .custom(value => Help.sanitizeInteger(value, 'capacity')),
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
    let response = [];
    const errors = validationResult(req).array();
    errors.map((error) => {
      if (error.msg !== 'Invalid value') response.push(error.msg);
      return null;
    });
    if (response.length === 0) {
      return next();
    }
    if (response.length === 1) [response] = response;
    return res.status(400).json(Help.getResponse(response));
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
    req.body.facilities.split('###:###:###').map(facility => facilities.push(facility.trim()));
    req.body.images.split('###:###:###').map((image, index) => {
      if (index <= 3) images.push(image.trim());
      return null;
    });
    req.body.facilities = facilities;
    req.body.images = images;
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
    database.center.findOne({
      where: {
        [Op.and]: {
          name: {
            [Op.iRegexp]: `^${req.body.name}$`,
          },
          address: {
            [Op.iRegexp]: `^${req.body.address}$`,
          },
        },
      },
    })
      .then((existingCenter) => {
        if (existingCenter) return res.status(400).json(Help.getResponse('center name already exists in center address'));
        return database.center.create(req.body)
          .then((center) => {
            jsonHandle(center);
            res.status(201).json(Help.getResponse(center, 'center', true));
          })
          .catch(() => {
            res.status(500).json(Help.getResponse('Internal server error'));
          });
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
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
        [Op.and]: {
          name: req.body.name,
          address: {
            [Op.iRegexp]: `^${req.body.address}$`,
          },
        },
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
              if (rows[0] === 0) return res.status(404).json(Help.getResponse('center not found'));
              return database.center.findOne({
                where: {
                  id: req.params.id,
                }
              })
                .then((updatedCenter) => {
                  jsonHandle(updatedCenter);
                  return res.json(Help.getResponse(updatedCenter, 'center', true));
                });
            })
            .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
        }
        return res.status(409).json(Help.getResponse('center name already exists in center address'));
      })
      .catch(() => res.status(500).json(Help.getResponse('Internal server error')));
  }

  /**
 * fetches existing centers
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing centers or fetch error message
 */
  static fetchAllCenters(req, res) {
    const filter = req.query.filter || '';
    const facility = req.query.facility || '';
    let { offset } = req.query;
    let { limit } = req.query;
    let capacity = req.query.capacity || 1;
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    capacity = parseInt(capacity, 10);
    const where = {
      capacity: {
        [Op.gte]: capacity,
      },
      facilities: {
        [Op.iRegexp]: `^.*${facility}.*$`,
      },
      [Op.or]: {
        name: {
          [Op.iRegexp]: `^.*${filter}.*$`,
        },
        address: {
          [Op.iRegexp]: `^.*${filter}.*$`,
        },
      },
    };
    const parameters = {};
    parameters.where = where;
    if (offset) parameters.offset = offset;
    if (limit) parameters.limit = limit;
    return database.center.findAll(parameters)
      .then((centers) => {
        centers.map((center) => {
          return jsonHandle(center);
        });
        return res.json(Help.getResponse(centers, 'centers', true));
      });
  }

  /**
 * fetches existing center
 * @param {object} req
 * @param {object} res
 * @returns { object } fetched center or fetch error message
 */
  static fetchCenter(req, res) {
    database.center.findOne({
      where: {
        id: req.params.id,
      }
    })
      .then((center) => {
        if (!center) return res.status(404).json(Help.getResponse('center not found'));
        jsonHandle(center);
        return res.json(Help.getResponse(center, 'center', true));
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
        if (!center) return res.status(404).json(Help.getResponse('center not found'));
        if (req.body.guests > center.capacity) return res.status(409).json(Help.getResponse('guests too large for this center'));
        let errorFound = false;
        center.events.map((event) => {
          if (event.id === req.params.id) return null;
          const { start, end } = event;
          if (moment(req.body.start, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(req.body.end, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(start, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')
           || moment(end, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')) {
            errorFound = true;
          }
          return null;
        });
        if (errorFound) return res.status(409).json(Help.getResponse('dates have been booked'));
        return next();
      });
  }
}

