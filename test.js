const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
  try {
    return await axios.get("https://place.map.kakao.com/8249354");
  } catch (error) {
    console.error(error);
  }
};

getHtml().then((html) => {
  let ulList = [];
  const $ = cheerio.load(html.data);
  console.log(html.data);
});
