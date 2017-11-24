import fs from 'fs';
import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { body, validationResult } from "express-validator/check";
import { sanitize } from 'express-validator/filter';

const storage = multer.diskStorage({
  destination(req, file, next) {
    next(null, './public/images')
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
  }
});

const options = {
  storage,
  fileFilter(req, file, next) {
    const isImage = file.mimetype.startsWith('image/');
    if(isImage) return next(null, true);
    return next({err: 'File type rejected' }, false);
  }
}; 

const upload = multer(options);

export class CenterController {

  static centerValidations() {
    return [
      body("name").exists().isLength({ min: 1 }).trim(),
      body("description").exists().isLength({ min: 1 }).trim(),
      body("facilities").exists().isLength({ min: 1 }).trim(),
      body("address").exists().isLength({ min: 1 }).trim(),
      // body("images").exists(),
      body("capacity").exists(),
      body("cost").exists(),
      sanitize("capacity").toInt(),
      sanitize("cost").toInt(),
    ]
  }

  static handleImages(){
    return upload.array('images', 4);
  } 

  static checkFailedValidations(req, res, next) {
    if(validationResult(req).isEmpty()) return next();
    console.log(validationResult(req).isEmpty());
    return res.json({ err: 'Incomplete details' });
  };

  static splitFacilities(req, res, next) {
    let facilities = [];
    req.body.facilities.split(',').map((facility) => {
      facilities.push(facility.trim());
    })
    req.body.facilities = facilities;
    return next();
  }

  static checkCostAndCapacityFields(req, res, next) {
    if(!Number.isInteger(req.body.cost) || !Number.isInteger(req.body.capacity) || [-1, 0, -0].includes(Math.sign(req.body.cost)) || [-1, 0, -0].includes(Math.sign(req.body.capacity))){
      return res.json({ err: 'Invalid details. Only positive integers allowed' });
    }
    return next(); 
  };

  static addCenter(req, res, next){
    req.body.images = [];
    for(let file of req.files){
      req.body.images.push(file.filename);
    };
    fs.readFile('./data/centers.json', (err, data) => {
      if(err) return res.json({ err: 'local file database failure' });
      let centers = JSON.parse(data);
      const centerId = uuidv4();
      centers[centerId] = req.body;
      let savedCenters = JSON.stringify(centers, null, 2);
      fs.writeFile('./data/centers.json', savedCenters, (err) => {
        if(err) return res.json({ err: 'local file database failure' });
        req.body.id = centerId;
        return res.json(req.body);
      })
    })
  }
  
}