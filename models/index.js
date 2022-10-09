const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; //추후 배포할 때는 process.env.NODE_ENV를 production으로 설정하면 된다.
const config = require("../config/config")[env]; // 데이터베이스 정보를 불러온다
const User = require("./user");
const Schedule = require("./schedule");
const Place = require("./place");

const db = {}; //Sequelize는 패키지임과 동시에 생성자 역할을 한다

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize; //sequelize를 나중에 재사용하기위해 db.sequelize에 넣어둠
db.User = User;
db.Schedule = Schedule;
db.Place = Place;

User.init(sequelize);
Schedule.init(sequelize);
Place.init(sequelize);

// db객체 안에 있는 모델들 간의 관계가 설정된다.
User.associate(db);
Schedule.associate(db);
Place.associate(db);

module.exports = db;
