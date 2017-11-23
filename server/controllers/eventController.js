import fs from 'fs';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { body, validationResult } from "express-validator/check";
import { sanitize } from 'express-validator/filter';

export class EventController {

  //validate incoming body fields for /events requests
  static eventValidations() {
    return [
      body("name").exists().withMessage('Missing event name').isLength({ min: 1 }).trim(),
      body("type").exists().isLength({ min: 1 }).trim(),
      body("center").exists().isLength({ min: 1 }).trim(),
      body("guests").exists().trim(),
      body("days").exists().trim(),
      body("start").exists().trim(),
      sanitize("days").toInt(),
      sanitize("guests").toInt()
    ];
  };

  //check if any of the above validations failed
  static checkFailedValidations(req, res, next) {
    if(validationResult(req).isEmpty()) return next();
    return res.json({ err: 'Incomplete details' });
  };

  //use moment.js to validate the start date field as correct date format and
  //also not a previous or current date
  static checkAndSanitizeDateFields(req, res, next) {
    if(!moment(req.body.start, 'DD-MM-YYYY').isValid() || !(moment(req.body.start, 'DD-MM-YYYY').isAfter(moment()))){
      return res.json({ err: 'Invalid details. Use format DD/MM/YYYY for date' });
    };
    req.body.start = moment(req.body.start, 'DD-MM-YYYY').format('DD MM YYYY').split(' ').join('/');
    req.body.end = moment(req.body.start, 'DD-MM-YYYY').add(req.body.days - 1, 'days').format('DD MM YYYY').split(' ').join('/');
    return next(); 
  };

  //validate the days and guests field as actual non signed integers
  static checkDaysAndGuestsFields(req, res, next) {
    if(!Number.isInteger(req.body.days) || !Number.isInteger(req.body.guests)|| [-1, 0, -0].includes(Math.sign(req.body.days)) || [-1, 0, -0].includes(Math.sign(req.body.guests))){
      return res.json({ err: 'Invalid details. Only positive integers allowed' });
    }
    return next(); 
  };

  /**Create new event by doing the following:
  -read the local database from file
  -parse it to json format
  -generate a unique id using uuidv4
  -save the event to the json object using the generated id
  -stringify the database
  -and write back to local file.*/
  static createEvent(req, res, next) {
    fs.readFile('./data/events.json', (err, data) => {
      if(err) return res.json({ err: 'local file database failure' });
      let events = JSON.parse(data);
      let eventId = uuidv4();
      events[eventId] = req.body;
      let savedEvents = JSON.stringify(events, null, 2);
      fs.writeFile('./data/events.json', savedEvents, (err) => {
        if(err) return res.json({ err: 'local file database failure' });
        req.body.id = eventId;
        return res.json(req.body);
      })
    })
  };
  
}

