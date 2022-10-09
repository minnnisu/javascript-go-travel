//nav태그와 카카오지도 크기를 모니터 해상도로 맞게 설정
$(".nav__search-result-container").css("height", window.innerHeight - 218);
$("#map").css("width", window.innerWidth - 400);
$("#map").css("height", window.innerHeight - 100);

window.onresize = function () {
  window.location.reload();
};

//여행 목적지 변경 모달 켜짐

$("#my-destination").click(function () {
  modalOn($("#destination-input-modal")); //모달 켜기

  // fetch("http://localhost:8080/set/destination?query=true").then(
  //   (response) => {
  //     if (!response.ok) {
  //       response.text().then((msg) => alert(msg));
  //     }
  //     window.location.reload();
  //   }
  // );
});

//태그 토글
$(".tag-show").click(function (e) {
  if ($(".place-tag").hasClass("hide") === true) {
    $(".place-tag").removeClass("hide");
  } else {
    $(".place-tag").addClass("hide");
  }
});

//태그 클릭 시 태그 내용의 검색결과를 보여줌
$(".nav__search-container .tag-set li").click(function (e) {
  const keyword = $(this).html();
  fetch("http://localhost:8080/search/place?query=" + keyword).then(
    (response) => {
      if (!response.ok) {
        response.text().then((msg) => alert(msg));
      } else {
        window.location.reload();
      }
    }
  );
});

//검색결과 페이지 전환
$(".page-container a").click(function (e) {
  const page = $(this).html();
  fetch("http://localhost:8080/search/place?page=" + page)
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});

//
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

//여행 목록 추가 모달 켜짐
$(".list-add").click(function () {
  const id = $(this).parents(".search-result-card").attr("id"); //선택한 여행지의 id
  const placeData = $(".nav__search-result-container")
    .children(".search-result-card")
    .eq(id - 1);
  const name = placeData.children(".card-name").html();
  const link = placeData.children(".card-name").attr("href");
  const address = placeData.children(".card-address").children(".value").html();
  const category = placeData
    .children(".card-category")
    .children(".value")
    .html();
  const phone = placeData
    .children(".hidden-data")
    .children(".card-phone")
    .html();
  const placeId = placeData
    .children(".hidden-data")
    .children(".card-place-id")
    .html();
  const x = placeData
    .children(".hidden-data")
    .children(".card-xy")
    .children(".x")
    .html();
  const y = placeData
    .children(".hidden-data")
    .children(".card-xy")
    .children(".y")
    .html();

  const modalContent = $("#list-add-modal .content .place-info"); //여행 목록 추가 모달의 콘텐츠 노드를 가져옴

  modalContent.children(".name").html(name);
  modalContent.children(".name").attr("href", link);
  modalContent.children(".address").children(".value").html(address);
  modalContent.children(".category").children(".value").html(category);
  modalContent.children(".phone").children(".value").html(phone);
  modalContent
    .children(".hidden-data")
    .children(".card-xy")
    .children(".x")
    .html(x);
  modalContent
    .children(".hidden-data")
    .children(".card-xy")
    .children(".y")
    .html(y);
  modalContent
    .children(".hidden-data")
    .children(".card-place-id")
    .html(placeId);

  modalOn($("#list-add-modal")); //모달 켜기
});

// 여행리스트에 추가
$("#list-add-form .submit").click(function () {
  if (
    $("#list-add-form input[name=date]").val() == "" ||
    $("#list-add-form input[name=time]").val() == ""
  ) {
    return alert("여행기간이 선택하세요");
  }

  const placeId = $(
    "#list-add-modal .place-info .hidden-data .card-place-id"
  ).html();
  const name = $("#list-add-modal .place-info .name").html();
  const x = $("#list-add-modal .place-info .hidden-data .card-xy .x").html();
  const y = $("#list-add-modal .place-info .hidden-data .card-xy .y").html();

  // 데이터베이스에 사용자의 여행리스트 추가
  fetch("http://localhost:8080/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: placeId,
      name: name,
      y: y,
      x: x,
      date: $("#list-add-form input[name=date]").val(),
      time: $("#list-add-form input[name=time]").val(),
      memo: $("#list-add-form textarea[name=memo]").val(),
    }),
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      alert("리스트에 추가하였습니다");
      window.location.reload();
    }
  });
});

//------------------------------------ 지도 관련 설정 ------------------------------------------------

// if ($(".nav__search-result-container").children().length == 1) {
//   fetch("http://localhost:8080/search/place?query=음식점").then((response) => {
//     if (!response.ok) {
//       response.text().then((msg) => alert(msg));
//     } else {
//       window.location.reload();
//     }
//   });
// }

//지표에 표시할 중심좌표
// const centerLatLng = {
//   x: Number($(".search-result-card .card-xy").children(".x").html()),
//   y: Number($(".search-result-card .card-xy").children(".y").html()),
// };

// // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
// const makeOverListener = (map, marker, infowindow) => {
//   return function () {
//     infowindow.open(map, marker);
//   };
// };

// // 인포윈도우를 닫는 클로저를 만드는 함수입니다
// const makeOutListener = (infowindow) => {
//   return function () {
//     infowindow.close();
//   };
// };

// var mapContainer = document.getElementById("map"), // 지도를 표시할 div
//   mapOption = {
//     center: new kakao.maps.LatLng(centerLatLng.y, centerLatLng.x), // 지도의 중심좌표
//     level: 3, // 지도의 확대 레벨
//   };

// var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// // 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다.
// const positions = [];

// $(".search-result-card").each(function (index) {
//   const LatLng = $(this).children(".hidden-data").children(".card-xy");
//   const x = Number(LatLng.children(".x").html());
//   const y = Number(LatLng.children(".y").html());
//   positions.push({
//     content: "<div>" + $(this).children(".card-name").html() + "</div>",
//     latlng: new kakao.maps.LatLng(y, x),
//   });
// });

// for (var i = 0; i < positions.length; i++) {
//   // 마커를 생성합니다
//   var marker = new kakao.maps.Marker({
//     map: map, // 마커를 표시할 지도
//     position: positions[i].latlng, // 마커의 위치
//   });

//   // 마커에 표시할 인포윈도우를 생성합니다
//   var infowindow = new kakao.maps.InfoWindow({
//     content: positions[i].content, // 인포윈도우에 표시할 내용
//   });

//   // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
//   // 이벤트 리스너로는 클로저를 만들어 등록합니다
//   // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
//   kakao.maps.event.addListener(
//     marker,
//     "mouseover",
//     makeOverListener(map, marker, infowindow)
//   );
//   kakao.maps.event.addListener(marker, "mouseout", makeOutListener(infowindow));
// }

// let prevInfoWindow = null;

// $(".card-button .loc-show").click(function (e) {
//   console.log(positions);
//   if (prevInfoWindow != null) {
//     prevInfoWindow.close();
//   }
//   const i = Number($(this).parents(".search-result-card").attr("id")) - 1;
//   var marker = new kakao.maps.Marker({
//     map: map, // 마커를 표시할 지도
//     position: positions[i].latlng, // 마커의 위치
//   });

//   // 마커에 표시할 인포윈도우를 생성합니다
//   var infowindow = new kakao.maps.InfoWindow({
//     content: positions[i].content, // 인포윈도우에 표시할 내용
//   });

//   prevInfoWindow = infowindow;

//   infowindow.open(map, marker);
// });
