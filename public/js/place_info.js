const currentUrl = new URL(location.href).searchParams;
const LatLng = {
  x: currentUrl.get("x"),
  y: currentUrl.get("y"),
};

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(LatLng.y, LatLng.x), // 지도의 중심좌표
    level: 1, // 지도의 확대 레벨
  };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(LatLng.y, LatLng.x);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

//현재 장소를 리스트에 추가하는 함수
async function addList() {
  if ($("input[name=date]").val() == "" || $("input[name=time]").val() == "") {
    return alert("여행기간이 선택하세요");
  }

  const url = new URL(location.href).searchParams;

  // 데이터베이스에 사용자의 여행리스트 추가
  fetch("http://localhost:8080/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: url.get("id"),
      name: url.get("name"),
      y: url.get("y"),
      x: url.get("x"),
      date: $("input[name=date]").val(),
      time: $("input[name=time]").val(),
      memo: $("textarea[name=memo]").val(),
    }),
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      alert("리스트에 추가하였습니다");
    }
  });
}
