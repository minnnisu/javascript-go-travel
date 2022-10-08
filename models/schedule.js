const Sequelize = require("sequelize");

module.exports = class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        date: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        memo: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, //createAt & updateAt 추가
        underscored: false, //column이름을 camalCase가 아닌 underscore방식으로 사용
        modelName: "Schedule", //모델이름
        tableName: "schedules", //테이블 이름
        charset: "utf8", //한국어 설정
        collate: "utf8_general_ci", //한국어 설정
      }
    );
  }
  static associate(db) {
    db.Schedule.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.Schedule.belongsTo(db.Place, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
