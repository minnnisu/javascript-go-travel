let LatLng_y = null;
let LatLng_x = null;

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(LatLng_y, LatLng_x), // 지도의 중심좌표
    level: 1, // 지도의 확대 레벨
  };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(LatLng_y, LatLng_x);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

//현재 장소를 리스트에 추가하는 함수
async function addList() {
  const targetLink = location.href; //현재 페이지 url
  const requestLink = targetLink.slice(0, 27) + "/info" + targetLink.slice(27);

  //현재 장소의 정보를 받아옴
  const placeInfo = await fetch(requestLink).then(async (result) => {
    return await result.json();
  });

  //위도경도 설정
  LatLng_x = placeInfo["x"];
  LatLng_y = placeInfo["y"];

  //localStorage에 저장할 데이터
  const data = {
    id: placeInfo["id"],
    name: placeInfo["place_name"],
    address: placeInfo["road_address_name"],
    category: placeInfo["category_name"],
    y: placeInfo["y"],
    x: placeInfo["x"],
    date: $("input[name=date]").val(),
    time: $("input[name=time]").val(),
    memo: $("textarea[name=memo]").val(),
    link: targetLink,
  };

  if (localStorage.getItem(placeInfo["id"])) {
    alert("이미 여행리스트에 추가되어있습니다.");
  } else {
    localStorage.setItem(placeInfo["id"], JSON.stringify(data));
    alert("여행리스트에 추가하였습니다.");
  }
}
