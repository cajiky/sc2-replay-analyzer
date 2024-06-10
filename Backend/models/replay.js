module.exports = (sequelize, DataTypes) => {
    const Replay = sequelize.define('Replay', {
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    }, {
      tableName: 'Replays',
      timestamps: true,
    });
  
    return Replay;
  };
  