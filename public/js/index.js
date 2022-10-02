//nav태그와 카카오지도 크기를 모니터 해상도로 맞게 설정
$("nav").css("height", screen.availHeight);
$("#map").css("height", screen.availHeight);
$("#map").css("width", screen.availWidth - 400);

const IsSearchResultNull = () => {
  if ($(".nav__search-result-container").children().length == 1) {
    fetch("http://localhost:8080/search/place?query=음식점").then(
      (response) => {
        if (!response.ok) {
          response.text().then((msg) => alert(msg));
        } else {
          window.location.reload();
        }
      }
    );
  }
};

//여행 목적지 변경
const changeDestination = () => {
  fetch("http://localhost:8080/search/destination?query=true").then(
    (response) => {
      if (!response.ok) {
        response.text().then((msg) => alert(msg));
      }
      window.location.reload();
    }
  );
};

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

//지표에 표시할 중심좌표
const centerLatLng = {
  x: Number($(".card-xy").children(".x").html()),
  y: Number($(".card-xy").children(".y").html()),
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

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(centerLatLng.y, centerLatLng.x), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다.
const positions = [];

$(".search-result-card").each(function (index) {
  const LatLng = $(this).children(".card-xy");
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

$(".search-result-card").click(function (e) {
  if (prevInfoWindow != null) {
    prevInfoWindow.close();
  }
  const i = Number($(this).attr("id"));
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

IsSearchResultNull();

// //여행 리스트 일부 삭제
// $(".nav__list-item .delete-button").click(function (e) {
//   fetch("http://localhost:8080/list?id=" + $(this).attr("id"), {
//     method: "DELETE",
//   }).then(() => {
//     window.location.reload();
//   });
// });

// $(".nav__list-item .more-button").click(function (e) {
//   const aTag = $(this).siblings()[0];
//   const url = new URL(aTag.href).searchParams;
//   fetch("http://localhost:8080/list/info", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       id: url.get("id"),
//       name: url.get("name"),
//       y: url.get("y"),
//       x: url.get("x"),
//     }),
//   });
// });

// $(".list__header-button-delete").click(function (e) {
//   fetch("http://localhost:8080/list/all", {
//     method: "DELETE",
//   }).then(() => {
//     window.location.reload();
//   });
// });
