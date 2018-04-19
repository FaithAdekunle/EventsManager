import jwt from 'jsonwebtoken';
import moment from 'moment';
import dotenv from 'dotenv';
import Helpers from './helpers';
import db from './db';

dotenv.config({ path: '.env' });

module.exports = class Middlewares {
  /**
    * ensures incoming id in url is valid
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns { function | object } next() if id parameter in url is
    * valid or sends error reaponse otherwise
    */
  static sanitizeParams(req, res, next) {
    let sanitized = true;
    let msg = '';
    ['id', 'centerId'].map((param) => {
      if (req.params[param]) {
        req.params[param] = parseInt(req.params[param], 10);
        if (!Number.isInteger(req.params[param])) {
          sanitized = false;
          msg = `invalid ${param} parameter`;
        }
      }
      return null;
    });
    if (sanitized === false) {
      return res.status(400).json(Helpers.getResponse(msg));
    }
    return next();
  }

  /**
    * verifies user token
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns { function | object } next()
    */
  static verifyUserToken(req, res, next) {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json(Helpers.getResponse('missing token'));
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) {
        return res.status(401).json(Helpers.getResponse('token has expired'));
      }
      return db.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).json(Helpers.getResponse('user not found'));
          }
          req.body.userId = user.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json(Helpers.getResponse('authentication failed'));
    }
  }

  /**
    * verifies admin token
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns { function | object } next()
    */
  static verifyAdmin(req, res, next) {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json(Helpers.getResponse('missing token'));
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      if (Date.now() >= payload.expires) {
        return res.status(401).json(Helpers.getResponse('token has expired'));
      }
      return db.user.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).json(Helpers.getResponse('admin not found'));
          }
          if (!user.isAdmin) {
            return res.status(401)
              .json(Helpers.getResponse('unauthorized token'));
          }
          req.body.updatedBy = payload.id;
          return next();
        });
    } catch (err) {
      return res.status(401).json(Helpers.getResponse('authentication failed'));
    }
  }

  /**
    * checks if a center is available to be booked
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns { object | function } next()
    */
  static checkAvailability(req, res, next) {
    db.center.findOne({
      where: {
        id: req.body.centerId,
      },
      include: [{
        model: db.event,
      }],
    })
      .then((center) => {
        if (!center) {
          return res.status(404).json(Helpers.getResponse('center not found'));
        }
        if (req.body.guests > center.capacity) {
          return res.status(409)
            .json(Helpers.getResponse('guests too large for this center'));
        }
        let errorFound = false;
        center.events.map((event) => {
          if (event.id === req.params.id) return null;
          const { start, end } = event;
          if (moment(req.body.start, 'DD-MM-YYYY')
            .isBetween(
              moment(start, 'DD-MM-YYYY'),
              moment(end, 'DD-MM-YYYY'), null, '[]',
            )
             || moment(req.body.end, 'DD-MM-YYYY').isBetween(
               moment(start, 'DD-MM-YYYY'),
               moment(end, 'DD-MM-YYYY'), null, '[]',
             )
             || moment(start, 'DD-MM-YYYY').isBetween(
               moment(req.body.start, 'DD-MM-YYYY'),
               moment(req.body.end, 'DD-MM-YYYY'), null, '[]',
             )
             || moment(end, 'DD-MM-YYYY').isBetween(
               moment(req.body.start, 'DD-MM-YYYY'),
               moment(req.body.end, 'DD-MM-YYYY'), null, '[]',
             )) {
            errorFound = true;
          }
          return null;
        });
        if (errorFound) {
          return res.status(409)
            .json(Helpers.getResponse('dates have been booked'));
        }
        return next();
      });
  }
};

