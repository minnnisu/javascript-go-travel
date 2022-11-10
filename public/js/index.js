//nav태그와 카카오지도 크기를 브라우저 해상도로 맞게 설정
$(".nav__search-result-container").css("height", window.innerHeight - 238);
$("#map").css("width", window.innerWidth);
$("#map").css("height", window.innerHeight - 100);

// 브라우저 사이즈를 조정할 때마다 새로고침
window.onresize = function () {
  window.location.reload();
};

$(document).ready(async function () {
  const placeIdList = [];
  for await (const element of $(".search-result-card")) {
    const url = $(element)
      .children(".info")
      .children(".card-name")
      .attr("href");

    const urlParams = new URLSearchParams(url);
    await fetch(
      "http://localhost:8080/place/thumbnail?placeId=" +
        urlParams.get("placeId")
    ).then(async (response) => {
      if (!response.ok) {
        response.text().then((msg) => console.log(msg));
      } else {
        const imgUrl = await response.text();
        const imgTag = $(
          '<img width="120" height="120" onerror="this.remove ? this.remove() : this.removeNode();"/>' //이미지 태그 생성(이미지가 없을 경우 DOM삭제)
        );
        imgTag.attr("src", imgUrl.slice(5, -2));
        $(element).children(".card-img").append(imgTag);
      }
    });
  }
});

//태그 토글
$(".tag-show").click(function (e) {
  $(".place-tag").toggle();
});

//태그 클릭 시 검색 결과를 보여줌
$(".nav__search-container .tag-set li").click(function (e) {
  const keyword = $(this).html();
  location.href = "http://localhost:8080/place?query=" + keyword + "&page=1";
});

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
const makeOverListener = (map, marker, infowindow) => {
  return function () {
    infowindow.open(map, marker);
  };
};

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
const makeOutListener = (infowindow) => {
  return function () {
    infowindow.close();
  };
};

//지도의 중심좌표 객체
const center = {
  x: Number($(".search-result-card .card-xy").children(".x").html()),
  y: Number($(".search-result-card .card-xy").children(".y").html()),
};

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(center.y, center.x), // 지도의 중심좌표 설정
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다
const positions = [];
let prevInfoWindow = null;

// 저장한 장소들마다 marker와 content를 생성합니다
$(".search-result-card").each(function (index) {
  // 장소의 x와 y좌표를 구함
  const LatLng = $(this)
    .children(".info")
    .children(".hidden-data")
    .children(".card-xy");
  const x = Number(LatLng.children(".x").html());
  const y = Number(LatLng.children(".y").html());

  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: new kakao.maps.LatLng(y, x), // 마커의 위치
  });

  // 마커에 표시할 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content:
      // "<div style='position: relative;" +
      // "top: 50%;" +
      // "left: 50%;" +
      // "transform: translate(-50%, -50%);>" +
      "<div>" +
      $(this).children(".info").children(".card-name").html() +
      "</div>",
    // 인포윈도우에 표시할 내용
  });

  $(this)
    .children(".info")
    .children(".card-button")
    .children(".loc-show")
    .on("click", function () {
      if (prevInfoWindow != null) {
        prevInfoWindow.close();
      }
      prevInfoWindow = infowindow;
      setCenter(x, y);
      infowindow.open(map, marker);
    });

  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다
  // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
  kakao.maps.event.addListener(marker, "click", function () {
    if (prevInfoWindow != null) {
      prevInfoWindow.close();
    }
    prevInfoWindow = infowindow;
    infowindow.open(map, marker);
  });
});

// 지도 중심을 부드럽게 이동시킵니다
function setCenter(x, y) {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(y, x);

  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
}
