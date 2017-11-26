import fs from 'fs';
import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { body, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';

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
const unmountImages = (obj) => {
  obj.images.map(image => fs.unlink(`./server/public/images/${image}`));
};

const upload = multer(options);

module.export = class CenterController {
  // validate incoming body fields for /events requests
  static centerValidations() {
    return [
      body('name').exists().isLength({ min: 1 }).trim(),
      body('description').exists().isLength({ min: 1 }).trim(),
      body('facilities').exists().isLength({ min: 1 }).trim(),
      body('address').exists().isLength({ min: 1 }).trim(),
      body('images').exists(),
      body('capacity').exists(),
      body('cost').exists(),
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
    req.body.images = [];
    if (req.files) {
      req.files.map(file => req.body.images.push(file.filename));
    }
    return next();
  }

  // checks if all validations have passed and that user uploaded images
  static checkFailedValidations(req, res, next) {
    if (
      validationResult(req).isEmpty()
      && Array.isArray(req.body.images)
      && req.body.images.length > 0) return next();
    unmountImages(req.body);
    return res.json({ err: 'Incomplete details' });
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
      return res.json({ err: 'Invalid details. Only positive integers allowed' });
    }
    return next();
  }

  /** Adds new center by doing the following:
  -read the local database from file
  -parse it to json format
  -generate a unique id using uuidv4
  -save the center to the json object using the generated id
  -stringify the database
  -and write back to local file. */
  static addCenter(req, res) {
    fs.readFile('./server/data/centers.json', (err, data) => {
      if (err) return res.json({ err: 'local file database failure' });
      const centers = JSON.parse(data);
      const centerId = uuidv4();
      centers[centerId] = req.body;
      const savedCenters = JSON.stringify(centers, null, 2);
      return fs.writeFile('./server/data/centers.json', savedCenters, (error) => {
        if (error) return res.json({ err: 'local file database failure' });
        req.body.id = centerId;
        return res.json(req.body);
      });
    });
  }

  /** Modify existing center by doing the following:
  -read the local database from file
  -parse it to json format
  -check if center with key route id parameter exists
  -deletes previous center images from storage if found then
  -overwrites center with new details
  -else respond with center not found
  -stringify the database
  -and write back to local file. */
  static modifyCenter(req, res) {
    fs.readFile('./server/data/centers.json', (err, data) => {
      if (err) return res.json({ err: 'local file database failure' });
      const centers = JSON.parse(data);
      if (!centers[req.params.id]) {
        unmountImages(req.body);
        return res.json({ err: 'center not found' });
      }
      const centerId = req.params.id;
      const center = centers[centerId];
      unmountImages(center);
      centers[centerId] = req.body;
      const savedCenters = JSON.stringify(centers, null, 2);
      return fs.writeFile('./server/data/centers.json', savedCenters, (error) => {
        if (error) return res.json({ err: 'local file database failure' });
        req.body.id = centerId;
        return res.json(req.body);
      });
    });
  }

  /** Fetch existing centers by doing the following:
  -read the local database from file
  -parse it to json format
  -initialize an empty array
  -push each center into empty array
  -respond with array of centers */
  static fetchCenters(req, res) {
    fs.readFile('./server/data/centers.json', (err, data) => {
      if (err) return res.json({ err: 'local file database failure' });
      const centersObject = JSON.parse(data);
      const centersEntries = Object.entries(centersObject);
      const centersArray = [];
      centersEntries.map((entry) => {
        const id = entry[0];
        const center = entry[1];
        center.id = id;
        return centersArray.push(entry[1]);
      });
      return res.json(centersArray);
    });
  }

  /** Fetch existing centers by doing the following:
  -read the local database from file
  -parse it to json format
  -check if center with key route id parameter exists
  -respond with center if found
  -else respond with center not found */
  static fetchCenter(req, res) {
    fs.readFile('./server/data/centers.json', (err, data) => {
      if (err) return res.json({ err: 'local file database failure' });
      const centersObject = JSON.parse(data);
      const centerId = req.params.id;
      if (!centersObject[centerId]) return res.json({ err: 'center not found' });
      return res.json(centersObject[centerId]);
    });
  }
};
