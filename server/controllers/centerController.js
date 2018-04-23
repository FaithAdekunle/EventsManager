import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { Op } from 'sequelize';
import db from '../db';
import Helpers from '../helpers';

module.exports = class CenterController {
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
        .custom(value => Helpers.sanitizeInteger(value, 'cost')),
      sanitize('capacity').toInt(),
      body('capacity')
        .custom(value => Helpers.sanitizeInteger(value, 'capacity')),
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
    return res.status(400).json(Helpers.getResponse(response));
  }

  static jsonHandle = (obj, parse = true) => {
    if (parse) {
      if (obj.images) obj.images = JSON.parse(obj.images);
      if (obj.facilities) obj.facilities = JSON.parse(obj.facilities);
    } else {
      if (obj.images) obj.images = JSON.stringify(obj.images);
      if (obj.facilities) obj.facilities = JSON.stringify(obj.facilities);
    }
  };

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
    req.body.facilities.split('###:###:###')
      .map(facility => facilities.push(facility.trim()));
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
    CenterController.jsonHandle(req.body, false);
    db.center.findOne({
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
        if (existingCenter) {
          return res.status(409)
            .json(Helpers
              .getResponse('center name already exists in center address'));
        }
        return db.center.create(req.body)
          .then((center) => {
            CenterController.jsonHandle(center);
            res.status(201).json(Helpers.getResponse(center, 'center', true));
          })
          .catch(() => {
            res.status(500).json(Helpers.getResponse('Internal server error'));
          });
      })
      .catch(() => res.status(500)
        .json(Helpers.getResponse('Internal server error')));
  }

  /**
 * modifies existing center
 * @param {object} req
 * @param {object} res
 * @returns { object } object containing modified center or sends error message
 */
  static modifyCenter(req, res) {
    db.center.findOne({
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
          CenterController.jsonHandle(req.body, false);
          return db.center.update(req.body, {
            where: {
              id: req.params.id,
            },
          })
            .then((rows) => {
              if (rows[0] === 0) {
                return res.status(404)
                  .json(Helpers.getResponse('center not found'));
              }
              return db.center.findOne({
                where: {
                  id: req.params.id,
                },
              })
                .then((updatedCenter) => {
                  CenterController.jsonHandle(updatedCenter);
                  return res.json(Helpers
                    .getResponse(updatedCenter, 'center', true));
                });
            })
            .catch(() => res.status(500)
              .json(Helpers.getResponse('Internal server error')));
        }
        return res.status(409)
          .json(Helpers
            .getResponse('center name already exists in center address'));
      })
      .catch(() => res.status(500)
        .json(Helpers.getResponse('Internal server error')));
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
    return db.center.findAll(parameters)
      .then((centers) => {
        centers.map(center => CenterController.jsonHandle(center));
        return res.json(Helpers.getResponse(centers, 'centers', true));
      });
  }

  /**
 * fetches existing center
 * @param {object} req
 * @param {object} res
 * @returns { object } fetched center or fetch error message
 */
  static fetchCenter(req, res) {
    db.center.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((center) => {
        if (!center) {
          return res.status(404).json(Helpers.getResponse('center not found'));
        }
        CenterController.jsonHandle(center);
        return res.json(Helpers.getResponse(center, 'center', true));
      });
  }
};

