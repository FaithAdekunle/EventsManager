// define model for event
module.exports = class EventModel {
/**
 * constructor
 * @param {object} sequelize
 * @param {object} DataTypes
 */
  constructor(sequelize, DataTypes) {
    this.sequelize = sequelize;
    this.DataTypes = DataTypes;
  }

  /**
   * creates model for event table in database
 * @returns { object } event model
 */
  eventModel() {
    const event = this.sequelize.define('event', {
      name: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      start: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      end: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      guests: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      days: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      images: {
        type: this.DataTypes.STRING,
        allowNull: true,
      },
      isAccepted: {
        type: this.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    return event;
  }
};
