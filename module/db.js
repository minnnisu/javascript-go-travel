const Place = require("../models/place");
const Schedule = require("../models/schedule");
const User = require("../models/user");

//로그인한 사용자의 여행리스트 목록을 반환
async function getTravelList(id) {
  // try {
  //   const data = await List.findAll({
  //     //DB로부터 사용자의 여행리스트목록을 가져옴
  //     where: {
  //       userId: id,
  //     },
  //   });
  //   const travelList = []; //목록이 저장된 data 객체를 필터링한 결과를 담는 리스트
  //   for (let element = 0; element < data.length; element++) {
  //     //필터링
  //     travelList[element] = data[element]["dataValues"];
  //   }
  //   return travelList;
  // } catch (error) {
  //   throw new Error(error);
  // }
}

async function getOneTravelPlace(userId, placeId) {
  // try {
  //   const data = await List.findAll({
  //     //DB로부터 사용자의 여행리스트목록을 가져옴
  //     where: {
  //       userId: userId,
  //       placeId: placeId,
  //     },
  //   });
  //   return data[0]["dataValues"];
  // } catch (error) {
  //   throw new Error(error);
  // }
}

async function getPlace(cityName, category) {
  try {
    const data = await Place.findAll({
      //DB로부터 사용자의 여행리스트목록을 가져옴
      where: {
        city: cityName,
        category: category,
      },
    });
    return data[0]["dataValues"];
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getTravelList, getOneTravelPlace, getPlace };
