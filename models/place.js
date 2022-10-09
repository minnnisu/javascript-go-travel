const Sequelize = require("sequelize");

module.exports = class Place extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        placeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
        },
        city: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        roadAddress: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        address: {
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
        phone: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        imgUrl: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, //createAt & updateAt 추가
        underscored: false, //column이름을 camalCase가 아닌 underscore방식으로 사용
        modelName: "Place", //모델이름
        tableName: "places", //테이블 이름
        charset: "utf8", //한국어 설정
        collate: "utf8_general_ci", //한국어 설정
      }
    );
  }
  static associate(db) {
    db.Place.hasMany(db.Schedule, {
      foreignKey: "placeId",
      targetKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
