const List = require("../models/list");

//로그인한 사용자의 여행리스트 목록을 반환
async function getTravelList(id) {
  try {
    const data = await List.findAll({
      //DB로부터 사용자의 여행리스트목록을 가져옴
      where: {
        userId: id,
      },
    });

    const travelList = []; //목록이 저장된 data 객체를 필터링한 결과를 담는 리스트
    for (let element = 0; element < data.length; element++) {
      //필터링
      travelList[element] = data[element]["dataValues"];
    }
    return travelList;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getTravelList };
