const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, //createAt & updateAt 추가
        underscored: false, //column이름을 camalCase가 아닌 underscore방식으로 사용
        modelName: "User", //모델이름
        tableName: "users", //테이블 이름
        paranoid: true, //deleteAt 추가
        charset: "utf8", //한국어 설정
        collate: "utf8_general_ci", //한국어 설정
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.List, {
      foreignKey: "userId",
      sourceKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
