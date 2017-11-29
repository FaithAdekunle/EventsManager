import fs from 'fs';
import moment from 'moment';
import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import database from '../db';

const storage = multer.diskStorage({
  destination(req, file, next) {
    next(null, './server/public/images');
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

// to delete files from storage
export const unmountImages = (obj) => {
  if (obj.images) obj.images.map(image => fs.unlink(`./server/public/images/${image}`, (err) => {}));
};

export const jsonHandle = (obj, parse = true) => {
  if (parse) {
    if (obj.images) obj.images = JSON.parse(obj.images);
    if (obj.facilities) obj.facilities = JSON.parse(obj.facilities);
  }
  else {
    if (obj.images) obj.images = JSON.stringify(obj.images);
    if (obj.facilities) obj.facilities = JSON.stringify(obj.facilities);
  }
};


const upload = multer(options);

export class CenterController {
  // validate incoming body fields for /events requests
  static centerValidations() {
    return [
      body('name')
        .exists()
        .withMessage('missing center name field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty center name not allowed'),
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
        .isLength({ min: 1 })
        .withMessage('empty center facilities not allowed'),
      body('address')
        .exists()
        .withMessage('missing center address field')
        .trim()
        .isLength({ min: 1 })
        .withMessage('empty center address not allowed'),
      body('images')
        .exists()
        .withMessage('no center image found'),
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

  // middleware to read imcoming uploaded files into local storage, hook up req.files and req.body
  static handleImages() {
    return upload.array('images', 4);
  }

  // middleware to mount names of saved files on req.body for validation check
  static mountImages(req, res, next) {
    const images = [];
    if (req.files) {
      req.files.map(file => images.push(file.filename));
    }
    if (images.length > 0) req.body.images = images;
    return next();
  }

  // checks if all validations have passed and that user uploaded images
  static checkFailedValidations(req, res, next) {
    if (validationResult(req).isEmpty()) return next();
    unmountImages(req.body);
    const errors = validationResult(req).array();
    return res.json({ err: errors[0].msg });
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
      return res.json({ err: 'Invalid details. Only positive integers allowed for cost and capacity fields' });
    }
    return next();
  }

  static addCenter(req, res) {
    req.body.createdBy = req.body.updatedBy;
    jsonHandle(req.body, false);
    database.center.create(req.body)
      .then((createdCenter) => {
        jsonHandle(createdCenter);
        res.json(createdCenter);
      })
      .catch((err) => {
        jsonHandle(req.body);
        unmountImages(req.body);
        res.status(400).json({ err: 'center name already exists' });
      });
  }

  static modifyCenter(req, res) {
    database.center.findOne({
      where: {
        name: req.body.name,
      },
    })
      .then((centerCheck) => {
        if (!centerCheck || (centerCheck.id == req.params.id)) {
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
              unmountImages(center);
              jsonHandle(req.body, false);
              return database.center.update(req.body, {
                where: {
                  id: req.params.id,
                },
              })
                .then((row) => {
                  if (row[0] > 0) {
                    database.center.findOne({
                      where: {
                        id: req.params.id,
                      },
                    })
                      .then((updatedCenter) => {
                        jsonHandle(updatedCenter);
                        return res.json(updatedCenter);
                      })
                      .catch(err => {});
                  }
                  unmountImages(req.body);
                  return res.json({ err: 'center name already exists' });
                })
                .catch(err => {});
            })
            .catch((err)=> {
              unmountImages(req.body);
              res.json({ err: 'problem occured updating center' });
            });
        }
        unmountImages(req.body);
        return res.json({ err: 'center name already exists' });
      })
      .catch((err) => {
        unmountImages(req.body);
        res.json({ err: 'problem occured modifying center' });
      });
  }

  static fetchCenters(req, res) {
    database.center.findAll({
      include: [
        { model: database.event },
      ],
    })
      .then((centers) => {
        centers.map((center) => {
          jsonHandle(center);
          center.events.map((event) => {
            jsonHandle(event);
          });
        });
        return res.json(centers);
      })
      .catch(err => res.json({ err: 'problem occured fetching centers' }));
  }

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
        if (!center) return res.json({ err: 'center not found' });
        jsonHandle(center);
        center.events.map((event) => {
          jsonHandle(event);
        });
        return res.json(center);
      })
      .catch(err => res.json({ err: 'problem occured fetching center' }));
  }

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
        for (const event of center.events) {
          if (event.id == req.params.id) continue;
          const { start, end } = event;
          if (moment(req.body.start, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(req.body.end, 'DD-MM-YYYY').isBetween(moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY'), null, '[]')
           || moment(start, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')
           || moment(end, 'DD-MM-YYYY').isBetween(moment(req.body.start, 'DD-MM-YYYY'), moment(req.body.end, 'DD-MM-YYYY'), null, '[]')) {
            unmountImages(req.body);
            return res.json({ err: 'dates have been booked' });
          }
        }
        return next();
      })
      .catch((err) => {
        unmountImages(req.body);
        res.json({ err: 'problem occured checking available dates' });
      });
  }
}

