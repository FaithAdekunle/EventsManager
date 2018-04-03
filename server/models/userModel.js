// define model for user
module.exports = class UserModel {
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
   * creates model for user table in database
 * @returns { object } user model
 */
  userModel() {
    const user = this.sequelize.define('user', {
      fullName: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: this.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: this.DataTypes.BOOLEAN,
        defaultValue: false,
      },

    });
    return user;
  }
};
