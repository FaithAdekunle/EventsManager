import express from 'express';
import { EventController } from '../controllers/eventController.js';
import { CenterController } from '../controllers/centerController.js';

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

     //route handler for modifying existing event
    router.put('/events/:id',
      EventController.eventValidations(),
      (req, res, next) => EventController.checkFailedValidations(req, res, next),
      (req, res, next) => EventController.checkDaysAndGuestsFields(req, res, next),
      (req, res, next) => EventController.checkAndSanitizeDateFields(req, res, next),
      (req, res, next) => EventController.modifyEvent(req, res, next)
    );

    //route handler for deleting existing event
    router.delete('/events/:id',
      (req, res, next) => EventController.deleteEvent(req, res, next)
    );

    //route handler for creating and adding a new center
    router.post('/centers',
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      CenterController.centerValidations(),
      (req, res, next) => CenterController.checkFailedValidations(req, res, next),
      (req, res, next) => CenterController.checkCostAndCapacityFields(req, res, next),
      (req, res, next) => CenterController.splitFacilities(req, res, next),
      (req, res, next) => CenterController.addCenter(req, res, next)
    )

    //route handler for modifying existing center
    router.put('/centers/:id',
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      CenterController.centerValidations(),
      (req, res, next) => CenterController.checkFailedValidations(req, res, next),
      (req, res, next) => CenterController.checkCostAndCapacityFields(req, res, next),
      (req, res, next) => CenterController.splitFacilities(req, res, next),
      (req, res, next) => CenterController.modifyCenter(req, res, next)
    );

    router.get('/centers',
      (req, res, next) => CenterController.fetchCenters(req, res, next)
    )

    return router;
  }
}

