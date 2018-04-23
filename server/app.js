import express from 'express';
import swagger from 'swagger-ui-express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import AppRouter from './routes/index';
import swaggerDoc from './openapi.json';
import db from './db';

/**
 * defines class for express application
 * @returns { void }
 */
class App {
  /** creates and defines dependencies for express app instance
   * @returns { object } express app instance
   */
  static setUp() {
    db.authenticate();
    db.setUp();
    db.sync();
    const app = express();
    app.use(cors());
    app.use('/docs', swagger.serve, swagger.setup(swaggerDoc));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/', AppRouter.Router());
    app.get(
      '/bundle.js',
      (req, res) => res.sendFile(
        'bundle.js',
        { root: path.resolve('./client/dist/app') },
      ),
    );
    app.use('/images', express.static(path.resolve('./client/src/images')));
    app.get('/*', (req, res) => res.sendFile(
      'index.html',
      { root: path.resolve('./client/dist') },
    ));
    return app;
  }
}

export default App.setUp();
