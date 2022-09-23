const Sequelize = require("sequelize");

module.exports = class List extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        placeId: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        y: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        x: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
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
        modelName: "List", //모델이름
        tableName: "list", //테이블 이름
        charset: "utf8", //한국어 설정
        collate: "utf8_general_ci", //한국어 설정
      }
    );
  }
  static associate(db) {
    db.List.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
