const axios = require("axios");
const cheerio = require("cheerio");
const { get } = require("request");

//좌표로 주소 찾는 함수
const headers = {
  Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
};

async function getAddressByLatLng(y, x) {
  try {
    const params = {
      x: x,
      y: y,
    };

    const result = await axios.get(
      "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
      {
        params,
        headers,
      }
    );
    return result.data["documents"][0];
  } catch (error) {
    throw new Error("잘못된 주소입니다.");
  }
}

//location ID와 같은 장소 검색하여 반환하는 함수
async function getInfoByLocation(placeID, query, y, x) {
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
      const result = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        { params, headers }
      );
      result.data["documents"].forEach((element) => {
        if (element["id"] == placeID) {
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
}
//장소와 관련된 블로그 정보를 반환하는 함수
async function getBlog(query, y, x) {
  let blog_arr = []; //페이지별 결과를 담는 리스트

  try {
    const addressInfo = await getAddressByLatLng(y, x); //좌표에 해당하는 주소를 받아옴

    const region =
      addressInfo["region_1depth_name"] +
      " " +
      addressInfo["region_2depth_name"]; //시군구 추출

    for (let page = 1; page <= 3; page++) {
      const params = {
        query: region + query, //시군구 + 장소이름 조합으로 검색
        page: page,
      };

      const result = await axios.get(
        encodeURI("https://dapi.kakao.com/v2/search/blog.json"),
        { params, headers }
      );

      blog_arr = blog_arr.concat(result.data["documents"]); //기존의 검색결과와 합치기
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
}

module.exports = { getInfoByLocation, getBlog };
