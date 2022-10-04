const moment = require("moment");
const data = [
  {
    date: "2022-09-28 12:37",
  },
  {
    date: "2022-09-27 14:27",
  },
  {
    date: "2022-10-05 02:34",
  },
  {
    date: "2022-10-05 15:34",
  },
  {
    date: "2022-10-05 15:35",
  },
];

// data.forEach((element) => {
//   var date = moment(element["date"]);
//   console.log(date.format("YY-MM-DD"));
// });

const orderedDate = data.sort((a, b) => moment(a.date) - moment(b.date));

let day = 1;
let targetDate = moment(data[0]["date"]).format("YY-MM-DD");
for (let idx = 0; idx < data.length; idx++) {
  const element = data[idx];
  if (targetDate < moment(element["date"]).format("YY-MM-DD")) {
    targetDate = moment(element["date"]).format("YY-MM-DD");
    day++;
  }
  element["day"] = day;
}

console.log(orderedDate);
