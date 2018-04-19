import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import swaggerTools from 'swagger-tools';
import bodyParser from 'body-parser';
import AppRouter from './routes/index';
import swaggerDoc from './openapi.json';
import db from './db';

const options = {
  controllers: './server/dist/controllers',
  useStubs: true,
};

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
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator());
      app.use(middleware.swaggerRouter(options));
      app.use(middleware.swaggerUi());
    });
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
