import fs from 'fs';
import moment from 'moment';
import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { Op } from 'sequelize';
import database from '../db';

// define storage option for multer
const storage = multer.diskStorage({
  destination(req, file, next) {
    next(null, './server/dist/public/images');
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
  },
});

// set multer options
const options = {
  storage,
  fileFilter(req, file, next) {
    const isImage = file.mimetype.startsWith('image/');
    if (isImage) return next(null, true);
    return next({ err: 'File type rejected' }, false);
  },
};

/** unmountImages(obj) removes all images
    whose names are present in obj.images */
export const unmountImages = (obj) => {
  if (obj.images) obj.images.map(image => fs.unlink(`./server/dist/public/images/${image}`, () => {}));
};

export const jsonHandle = (obj, parse = true) => {
  if (parse) {
    if (obj.images) obj.images = JSON.parse(obj.images);
    if (obj.facilities) obj.facilities = JSON.parse(obj.facilities);
  } else {
    if (obj.images) obj.images = JSON.stringify(obj.images);
    if (obj.facilities) obj.facilities = JSON.stringify(obj.facilities);
  }
};


const upload = multer(options);

/** CenterController class defines static
    methods to be used in handling /centers
    routes */
export class CenterController {
  // validate incoming body fields for /events requests
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
      sanitize('capacity').toInt(),
      sanitize('cost').toInt(),
    ];
  }

  /** handleImages() reads imcoming uploaded files
    into local storage, hooks up req.files and req.body */
  static handleImages() {
    return upload.array('images', 4);
  }

  /** mountImages(req, res, next) mounts names of
      saved files in req.files on req.body for validation check  */
  static mountImages(req, res, next) {
    const images = [];
    if (req.files) {
      req.files.map(file => images.push(file.filename));
    }
    if (images.length > 0) req.body.images = images;
    return next();
  }

  /* checkFailedValidations(req, res, next) checks if
   all validations have passed and that user uploaded mount  */
  static checkFailedValidations(req, res, next) {
    const response = [];
    if (validationResult(req).isEmpty()) {
      return next();
    }
    unmountImages(req.body);
    const errors = validationResult(req).array();
    errors.map(error => response.push(error.msg));
    return res.status(400).json({ err: response });
  }

  // splits facilities string to be saved as an array in storage
  static splitFacilities(req, res, next) {
    const facilities = [];
    req.body.facilities.split(',').map(facility => facilities.push(facility.trim()));
    req.body.facilities = facilities;
    return next();
  }

  // checks that cost and capacity hold valid values
  static checkCostAndCapacityFields(req, res, next) {
    if (!Number.isInteger(req.body.cost)
      || !Number.isInteger(req.body.capacity)
      || [-1, 0, -0].includes(Math.sign(req.body.cost))
      || [-1, 0, -0].includes(Math.sign(req.body.capacity))) {
      unmountImages(req.body);
      return res.status(400).json({ err: 'Invalid details. Only positive integers allowed for cost and capacity fields' });
    }
    if (req.body.cost > 2147483647) return res.status(400).json({ err: 'cost too large' });
    if (req.body.capacity > 2147483647) return res.status(400).json({ err: 'capacity too large' });
    return next();
  }

  // addCenter(req, res) adds a new center to database
  static addCenter(req, res) {
    req.body.createdBy = req.body.updatedBy;
    if (req.body.state) req.body.state = req.body.state.toLowerCase();
    if (!req.body.images) req.body.images = [];
    jsonHandle(req.body, false);
    database.center.create(req.body)
      .then((createdCenter) => {
        jsonHandle(createdCenter);
        res.status(201).json(createdCenter);
      })
      .catch(() => {
        jsonHandle(req.body);
        unmountImages(req.body);
        res.status(400).json({ err: 'center name already exists' });
      });
  }

  // modifyCenter(req, res) modifies details of an existing center
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
          return database.center.findOne({
            where: {
              id: req.params.id,
            },
          })
            .then((center) => {
              if (!center) {
                unmountImages(req.body);
                return res.json({ err: 'center not found' });
              }
              jsonHandle(center);
              if (req.body.images) unmountImages(center);
              jsonHandle(req.body, false);
              if (req.body.state) req.body.state = req.body.state.toLowerCase();
              return database.center.update(req.body, {
                where: {
                  id: req.params.id,
                },
              })
                .then((row) => {
                  if (row[0] > 0) {
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
                  }
                  jsonHandle(req.body);
                  unmountImages(req.body);
                  return res.status(409).json({ err: 'center name already exists' });
                });
            })
            .catch(err => res.status(500).json({ err: err.message || 'database error' }));
        }
        unmountImages(req.body);
        return res.status(409).json({ err: 'center name already exists' });
      });
  }

  // fetchCenters(req, res) fetches the details of all centers including their events
  static fetchCenters(req, res) {
    if (req.query.state) {
      return database.center.findAll({
        where: {
          state: req.query.state,
        },
      })
        .then(centers => res.json(centers))
        .catch(err => res.status(500).json({ err: err.message || 'problem occured searching database' }));
    }
    return database.center.findAll({
      include: [
        { model: database.event },
      ],
    })
      .then((centers) => {
        centers.map((center) => {
          jsonHandle(center);
          return center.events.map(event => jsonHandle(event));
        });
        return res.json(centers);
      });
  }

  // fetchCenters(req, res) fetches the details of one center including it's events
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
        center.events.map(event => jsonHandle(event));
        return res.send(center);
      });
  }

  /** checkAvailability(req, res, next) checks if dates
      for an event to be set in a particular center are
      available */
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
        if (!center) {
          unmountImages(req.body);
          return res.status(404).json({ err: 'center not found' });
        }
        for (const event of center.events) {
          if (event.id === req.params.id) continue;
          const { start, end } = event;
          if (moment(req.body.start, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(req.body.end, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(start, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')
           || moment(end, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')) {
            unmountImages(req.body);
            return res.status(409).json({ err: 'dates have been booked' });
          }
        }
        return next();
      });
  }
}

