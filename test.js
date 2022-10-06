const axios = require("axios");

const headers = {
  Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
};

async function getImage() {
  try {
    const params = {
      query: "동아식당",
    };

    const result = await axios.get("https://dapi.kakao.com/v2/search/image", {
      params,
      headers,
    });
    console.log(result.data["documents"][0]["image_url"]);
  } catch (error) {
    console.log(error);
  }
}

console.log(getImage());
