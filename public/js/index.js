//nav태그와 카카오지도 크기를 브라우저 해상도로 맞게 설정
// $(".nav__search-result-container").css("height", window.innerHeight - 218);
// $("#map").css("width", window.innerWidth - 400);
$(".nav__search-result-container").css("height", window.innerHeight - 238);
$("#map").css("width", window.innerWidth);
$("#map").css("height", window.innerHeight - 100);

// 브라우저 사이즈를 조정할 때마다 새로고침
window.onresize = function () {
  window.location.reload();
};

// $(document).ready(async function () {
//   const placeIdList = [];
//   for await (const element of $(".search-result-card")) {
//     const url = $(element).children(".card-name").attr("href");
//     await fetch(
//       "http://localhost:8080/place/thumbnail?placeId=" + url.split("/")[3]
//     ).then(async (response) => {
//       if (!response.ok) {
//         response.text().then((msg) => console.log(msg));
//       } else {
//         const imgUrl = await response.text();
//         $(element)
//           .children(".card-img")
//           .children("img")
//           .attr("src", imgUrl.slice(5, -2));
//       }
//     });
//   }
// });

//여행 목적지 변경
$(".my-destination").click(function () {
  $("#destination-input-modal").show();
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

//지표에 표시할 중심좌표
const centerLatLng = {
  x: Number($(".search-result-card .card-xy").children(".x").html()),
  y: Number($(".search-result-card .card-xy").children(".y").html()),
};

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

// 모달 켜기
function modalOn(modal) {
  modal.css("display", "flex");
}

//모달 켜짐 여부
function isModalOn() {
  return $(".modal-overlay").css("display") == "flex";
}

//모달 종료
function modalOff() {
  $(".modal-overlay").css("display", "none");
}

//닫기 버튼 클릭시 모달 종료
const closeBtn = $(".material-icons.close-area");
closeBtn.click((e) => {
  modalOff();
});

//모달 외부 영역 클릭 시 모달 종료
document.querySelector(".modal-overlay").addEventListener("click", (e) => {
  const evTarget = e.target;
  if (evTarget.classList.contains("modal-overlay")) {
    modalOff();
  }
});

//모달이 켜진 상태에서 esc키를 누를 경우 모달 종료
window.addEventListener("keyup", (e) => {
  if (isModalOn() && e.key === "Escape") {
    modalOff();
  }
});

//여행 목적지 변경 모달 켜짐
$(".destination-change").click(function () {
  modalOn($("#destination-input-modal")); //모달 켜기
});

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(centerLatLng.y, centerLatLng.x), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다.
const positions = [];

$(".search-result-card").each(function (index) {
  const LatLng = $(this).children(".hidden-data").children(".card-xy");
  const x = Number(LatLng.children(".x").html());
  const y = Number(LatLng.children(".y").html());
  positions.push({
    content: "<div>" + $(this).children(".card-name").html() + "</div>",
    latlng: new kakao.maps.LatLng(y, x),
  });
});

for (var i = 0; i < positions.length; i++) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: positions[i].latlng, // 마커의 위치
  });

  // 마커에 표시할 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: positions[i].content, // 인포윈도우에 표시할 내용
  });

  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다
  // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
  kakao.maps.event.addListener(
    marker,
    "mouseover",
    makeOverListener(map, marker, infowindow)
  );
  kakao.maps.event.addListener(marker, "mouseout", makeOutListener(infowindow));
}

let prevInfoWindow = null;

$(".card-button .loc-show").click(function (e) {
  console.log(positions);
  if (prevInfoWindow != null) {
    prevInfoWindow.close();
  }
  const i = Number($(this).parents(".search-result-card").attr("id")) - 1;
  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: positions[i].latlng, // 마커의 위치
  });

  // 마커에 표시할 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: positions[i].content, // 인포윈도우에 표시할 내용
  });

  prevInfoWindow = infowindow;

  infowindow.open(map, marker);
});
