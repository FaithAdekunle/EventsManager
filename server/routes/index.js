import express from 'express';
import EventController from '../controllers/eventController';
import { CenterController } from '../controllers/centerController';
import UserController from '../controllers/userController';


const router = express.Router();

module.exports = class AppRouter {
  static Router() {
    // route handler for creating a new event
    router.post(
      '/api/v1/events',
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      EventController.eventValidations(),
      (req, res, next) => EventController.checkFailedValidations(req, res, next),
      (req, res, next) => EventController.checkDaysAndGuestsFields(req, res, next),
      (req, res, next) => EventController.checkAndSanitizeDateFields(req, res, next),
      (req, res, next) => UserController.verifyUserToken(req, res, next),
      (req, res, next) => CenterController.checkAvailability(req, res, next),
      (req, res) => EventController.createEvent(req, res),
    );

    // route handler for modifying existing event
    router.put(
      '/api/vi/events/:id',
      (req, res, next) => UserController.sanitizeId(req, res, next),
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      EventController.eventValidations(),
      (req, res, next) => EventController.checkFailedValidations(req, res, next),
      (req, res, next) => EventController.checkDaysAndGuestsFields(req, res, next),
      (req, res, next) => EventController.checkAndSanitizeDateFields(req, res, next),
      (req, res, next) => UserController.verifyUserToken(req, res, next),
      (req, res, next) => CenterController.checkAvailability(req, res, next),
      (req, res) => EventController.modifyEvent(req, res),
    );

    // route handler for deleting existing event
    router.get(
      '/api/v1/events',
      (req, res, next) => UserController.verifyUserToken(req, res, next),
      (req, res) => EventController.fetchUserEvents(req, res),
    );

    // route handler for deleting existing event
    router.delete(
      '/api/v1/events/:id',
      (req, res, next) => UserController.sanitizeId(req, res, next),
      (req, res, next) => UserController.verifyUserToken(req, res, next),
      (req, res) => EventController.deleteEvent(req, res),
    );

    // route handler for creating and adding a new center
    router.post(
      '/api/v1/centers',
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      CenterController.centerValidations(),
      (req, res, next) => CenterController.checkFailedValidations(req, res, next),
      (req, res, next) => CenterController.checkCostAndCapacityFields(req, res, next),
      (req, res, next) => CenterController.splitFacilities(req, res, next),
      (req, res, next) => UserController.verifyAdmin(req, res, next),
      (req, res) => CenterController.addCenter(req, res),
    );

    // route handler for modifying existing center
    router.put(
      '/api/v1/centers/:id',
      (req, res, next) => UserController.sanitizeId(req, res, next),
      CenterController.handleImages(),
      (req, res, next) => CenterController.mountImages(req, res, next),
      CenterController.centerValidations(),
      (req, res, next) => CenterController.checkFailedValidations(req, res, next),
      (req, res, next) => CenterController.checkCostAndCapacityFields(req, res, next),
      (req, res, next) => CenterController.splitFacilities(req, res, next),
      (req, res, next) => UserController.verifyAdmin(req, res, next),
      (req, res) => CenterController.modifyCenter(req, res),
    );

    // route handler for fetchinging all existing centers
    router.get(
      '/api/v1/centers/:id',
      (req, res, next) => UserController.sanitizeId(req, res, next),
      (req, res) => CenterController.fetchCenter(req, res),
    );

    // route handler for fetching existing center
    router.get(
      '/api/v1/centers',
      (req, res) => CenterController.fetchCenters(req, res),
    );

    // route handler for creating new user
    router.post(
      '/api/v1/users',
      UserController.userValidations(),
      (req, res, next) => UserController.checkFailedValidations(req, res, next),
      (req, res, next) => UserController.toLowerCase(req, res, next),
      (req, res, next) => UserController.hashPassword(req, res, next),
      (req, res) => UserController.signUp(req, res),
    );

    // route handler to login existing center
    router.post(
      '/api/v1/users/login',
      UserController.signInValidations(),
      (req, res, next) => UserController.checkFailedValidations(req, res, next),
      (req, res, next) => UserController.toLowerCase(req, res, next),
      (req, res) => UserController.signIn(req, res),
    );

    return router;
  }
};

