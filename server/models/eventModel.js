// define model for event
module.exports = class EventModel {
  constructor(sequelize, DataTypes) {
    this.sequelize = sequelize;
    this.DataTypes = DataTypes;
  }

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
    });
    return event;
  }
};
