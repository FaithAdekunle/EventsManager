/**
 * class for center model
 */
class CenterModel {
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
   * creates model for center table in database
 * @returns { object } center model
 */
  centerModel() {
    const center = this.sequelize.define('center', {
      name: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      },
      facilities: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return center;
  }
}

export default CenterModel;
