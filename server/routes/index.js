import express from 'express';
import { EventController } from '../controllers/eventController.js';

const router = express.Router();

export class AppRouter {
  
  static Router() {
    
    //route handler for creating a new event
    router.post('/events',
      EventController.eventValidations(),
      (req, res, next) => EventController.checkFailedValidations(req, res, next),
      (req, res, next) => EventController.checkDaysAndGuestsFields(req, res, next),
      (req, res, next) => EventController.checkAndSanitizeDateFields(req, res, next),
      (req, res, next) => EventController.createEvent(req, res, next)
    );

    return router;
  }
}

