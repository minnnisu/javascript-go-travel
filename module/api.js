const axios = require("axios");
const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const driver_options = new chrome.Options();
/*
chrome driver 사용법(mac os기준)
1. 현재 크롬 브라우저에 맞는 버전의 chrome driver 설치
2. finder에서 chromedriver파일을 ctrl+클릭으로 실행
 */
driver_options.addArguments("--headless");
require("dotenv").config();
const headers = {
  Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
};

const divideCategory = (category) => {
  //카테고리에서 필요한 부분만 추출
  const splited_category = category.split(" > ");
  if (splited_category.length < 3) {
    return splited_category[1];
  } else {
    return splited_category[1] + " > " + splited_category[2];
  }
};

//지명으로 좌표 찾는 함수
module.exports.getLatLngbyAddress = async (query) => {
  const params = {
    query: query,
  };

  try {
    const response = await axios.get(
      "https://dapi.kakao.com//v2/local/search/address",
      {
        params,
        headers,
      }
    );
    const address = response.data["documents"][0]["address"];
    console.log(address);

    return address;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getOneInfoByLocation = async (placeID, query, y, x) => {
  let placeInfo = null;

  try {
    for (let i = 1; i <= 3; i++) {
      //결과를 찾은 경우 반환
      if (placeInfo != null) return placeInfo;

      const params = {
        query: query,
        page: i,
        x: x,
        y: y,
      };
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        { params, headers }
      );
      response.data["documents"].forEach((element) => {
        if (element["id"] == placeID) {
          element["category_name"] = divideCategory(element["category_name"]);
          placeInfo = element;
        }
      });
    }

    if (placeInfo == null)
      throw new Error(
        "요청한 페이지를 찾을 수 없습니다. 사이트 관리자에게 문의해 주세요"
      );
  } catch (error) {
    throw new Error(error);
  }
};

//location ID와 같은 장소 검색하여 반환하는 함수
module.exports.getInfoByLocation = async (query, y, x, page) => {
  try {
    const params = {
      query: query,
      page: page,
      x: x,
      y: y,
    };

    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json",
      { params, headers }
    );
    const placeList = response.data["documents"];
    placeList.forEach((element) => {
      element["category_name"] = divideCategory(element["category_name"]);
    });

    return placeList;
  } catch (error) {
    throw new Error(error);
  }
};
//장소와 관련된 블로그 정보를 반환하는 함수
module.exports.getBlog = async (query, y, x) => {
  let blog_arr = []; //페이지별 결과를 담는 리스트

  try {
    const addressInfo = await this.getAddressByLatLng(y, x); //좌표에 해당하는 주소를 받아옴
    //시군구 추출
    const region =
      addressInfo["region_1depth_name"] +
      " " +
      addressInfo["region_2depth_name"];

    for (let page = 1; page <= 3; page++) {
      const params = {
        query: region + query, //시군구 + 장소이름 조합으로 검색
        page: page,
      };

      const response = await axios.get(
        encodeURI("https://dapi.kakao.com/v2/search/blog.json"),
        { params, headers }
      );

      blog_arr = blog_arr.concat(response.data["documents"]); //기존의 검색결과와 합치기
    }

    //정규표현식을 이용하여 블로그 내용 내 html태그 제거
    for (let idx = 0; idx < blog_arr.length; idx++) {
      const reg = /<[^>]*>?/g; //모든 html태그들을 찾는 정규표현식
      blog_arr[idx]["blogname"] = blog_arr[idx]["blogname"].replace(reg, "");
      blog_arr[idx]["blogname"] = blog_arr[idx]["blogname"].replace(reg, "");
      blog_arr[idx]["title"] = blog_arr[idx]["title"].replace(reg, "");
      blog_arr[idx]["title"] = blog_arr[idx]["title"].replace(reg, "");
      blog_arr[idx]["contents"] = blog_arr[idx]["contents"].replace(reg, "");
      blog_arr[idx]["contents"] = blog_arr[idx]["contents"].replace(reg, "");
    }
    return blog_arr;
  } catch (error) {
    throw new Error(error);
  }
};

//좌표로 주소 찾는 함수
module.exports.getAddressByLatLng = async (y, x) => {
  try {
    const params = {
      x: x,
      y: y,
    };

    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
      {
        params,
        headers,
      }
    );
    return response.data["documents"][0];
  } catch (error) {
    throw new Error("잘못된 주소입니다.");
  }
};

module.exports.getImage = async (url) => {
  try {
    const driver = new selenium.Builder()
      .forBrowser(selenium.Browser.CHROME)
      .setChromeOptions(driver_options)
      .build();
    await driver.get(url);
    await driver.wait(
      selenium.until.elementLocated(selenium.By.css(".link_photo")),
      1000
    );
    const imgUrl = await driver
      .findElement(selenium.By.css(".link_photo"))
      .getCssValue("background-image");
    return imgUrl;
  } catch (error) {
    console.log(error);
  }
  driver.quit();
  return places;
};
