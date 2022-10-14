// const selenium = require("selenium-webdriver");

// const { getInfoByLocation } = require("./module/api");

// const driver = new selenium.Builder()
//   .forBrowser(selenium.Browser.CHROME)
//   .build();

// const wait = (sec) => {
//   let start = Date.now(),
//     now = start;
//   while (now - start < sec * 1000) {
//     now = Date.now();
//   }
// };

// const link = [];

// const getImage = async () => {
//   for (const element of link) {
//     try {
//       await driver.get(element);
//       wait(0.3);
//       const imgUrl = await driver
//         .findElement(selenium.By.css(".link_photo"))
//         .getCssValue("background-image");
//       console.log(imgUrl);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

// getInfoByLocation("음식점", 35.87222, 128.6025, 1).then((respone) => {
//   respone.forEach(async (element) => {
//     link.push(element.place_url);
//   });
//   getImage().then(() => {
//     driver.quit();
//   });
// });

const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const { getInfoByLocation } = require("./module/api");

const driver_options = new chrome.Options();
driver_options.addArguments("--headless");
/* 또는 driver_options.headless() */

const driver = new selenium.Builder()
  .forBrowser(selenium.Browser.CHROME)
  .setChromeOptions(driver_options)
  .build();

const getImage = async (url) => {
  try {
    await driver.get(url);
    await driver.wait(
      selenium.until.elementLocated(selenium.By.css(".link_photo")),
      1000
    );
    const imgUrl = await driver
      .findElement(selenium.By.css(".link_photo"))
      .getCssValue("background-image");
    console.log(imgUrl);
  } catch (error) {
    console.log(error);
  }
};

getInfoByLocation("음식점", 35.87222, 128.6025, 1).then(async (places) => {
  for (const place of places) {
    await getImage(place.place_url);
  }
  driver.quit();
});
