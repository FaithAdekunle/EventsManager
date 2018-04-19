import express from 'express';
import EventController from '../controllers/eventController';
import CenterController from '../controllers/centerController';
import UserController from '../controllers/userController';
import Middlewares from '../middlewares';


const router = express.Router();

module.exports = class AppRouter {
/**
 * defines routes endpoints for the api
 * @returns { void }
 */
  static Router() {
    // route handler for creating event
    router.post(
      '/api/v1/events',
      EventController.eventValidations(),
      EventController.checkFailedValidations,
      EventController.checkAndSanitizeDateFields,
      Middlewares.verifyUserToken,
      Middlewares.checkAvailability,
      EventController.createEvent,
    );

    // route handler for modifying existing event
    router.put(
      '/api/v1/events/:id',
      Middlewares.sanitizeParams,
      EventController.eventValidations(),
      EventController.checkFailedValidations,
      EventController.checkAndSanitizeDateFields,
      Middlewares.verifyUserToken,
      Middlewares.checkAvailability,
      EventController.modifyEvent,
    );

    // route handler for deleting existing event
    router.get(
      '/api/v1/events',
      Middlewares.verifyUserToken,
      EventController.fetchUserEvents,
    );

    router.get(
      '/api/v1/:centerId/events',
      Middlewares.sanitizeParams,
      EventController.fetchCenterEvents,
    );

    // route handler for declining existing event
    router.put(
      '/api/v1/events/:id/decline',
      Middlewares.sanitizeParams,
      Middlewares.verifyAdmin,
      EventController.declineUserEvent,
      EventController.sendMail,
    );

    // route handler for deleting existing event
    router.delete(
      '/api/v1/events/:id',
      Middlewares.sanitizeParams,
      Middlewares.verifyUserToken,
      EventController.deleteEvent,
    );

    // route handler for creating and adding a new center
    router.post(
      '/api/v1/centers',
      CenterController.centerValidations(),
      CenterController.checkFailedValidations,
      CenterController.splitFacilitiesAndImages,
      Middlewares.verifyAdmin,
      CenterController.addCenter,
    );

    // route handler for modifying existing center
    router.put(
      '/api/v1/centers/:id',
      Middlewares.sanitizeParams,
      CenterController.centerValidations(),
      CenterController.checkFailedValidations,
      CenterController.splitFacilitiesAndImages,
      Middlewares.verifyAdmin,
      CenterController.modifyCenter,
    );

    // route handler for fetchinging all existing centers
    router.get(
      '/api/v1/centers/:id',
      Middlewares.sanitizeParams,
      CenterController.fetchCenter,
    );

    // route handler for fetching existing center
    router.get(
      '/api/v1/centers',
      CenterController.fetchAllCenters,
    );

    // route handler for creating new user
    router.post(
      '/api/v1/users',
      UserController.userValidations(),
      UserController.checkFailedValidations,
      UserController.toLowerCase,
      UserController.hashPassword,
      UserController.signUp,
    );

    // route handler to login existing center
    router.post(
      '/api/v1/users/login',
      UserController.signInValidations(),
      UserController.checkFailedValidations,
      UserController.toLowerCase,
      UserController.signIn,
    );

    return router;
  }
};

