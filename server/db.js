import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './models/userModel';
import EventModel from './models/eventModel';
import CenterModel from './models/centerModel';

dotenv.config({ path: '.env' });

/**
 * @returns { void }
 */
class Database {
  /**
   * constructor
   */
  constructor() {
    this.Sequelize = Sequelize;
    const mode = process.env.NODE_ENV || 'development';
    let database;
    if (mode === 'test') {
      database = process.env.TEST_DATABASE;
    } else if (mode === 'development') {
      database = process.env.DEV_DATABASE;
    } else {
      database = process.env.PROD_DATABASE;
    }
    this.sequelize = new this.Sequelize(database);
    const userModel = new UserModel(this.sequelize, this.Sequelize);
    const eventModel = new EventModel(this.sequelize, this.Sequelize);
    const centerModel = new CenterModel(this.sequelize, this.Sequelize);
    this.db_user = userModel.userModel();
    this.db_event = eventModel.eventModel();
    this.db_center = centerModel.centerModel();
  }

  /**
   * authenticates connection to database
   * @returns { void }
   */
  authenticate() {
    this.sequelize
      .authenticate()
      .then(() => {})
      .catch();
  }

  /**
   * sets up model associations
   * @returns { void }
   */
  setUp() {
    this.db_user.hasMany(this.db_event, { allowNull: false });
    this.db_center.hasMany(this.db_event, { allowNull: false });
    this.db_user.hasMany(this.db_center, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false,
      },
    });
  }

  /**
   * synchronize models with database
   * @returns { void }
   */
  sync() {
    this.sequelize
      .sync({
        force: process.NODE_ENV === 'test',
      })
      .then(() => {})
      .catch();
  }

  /**
   * @returns { object } instance of database's user table
   */
  get user() {
    return this.db_user;
  }

  /**
   * @returns { object } instance of database's center table
   */
  get center() {
    return this.db_center;
  }

  /**
   * @returns { object } instance of database's event table
   */
  get event() {
    return this.db_event;
  }
}

module.exports = new Database();
