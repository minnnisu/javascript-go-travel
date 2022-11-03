$(".nav__user-planner-container").css("height", window.innerHeight - 162);
$("#map").css("width", window.innerWidth);
$("#map").css("height", window.innerHeight - 100);

window.onresize = function () {
  window.location.reload();
};

$("nav .right .data-control .list-modify").click(function () {
  console.log("modify");
});

// 모달 켜기
function modalOn() {
  $(".modal-overlay").css("display", "flex");
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

// 목적지 변경 모달을 킴
$(".my-destination").click(function () {
  $("#destination-input-modal").show();
});

$("#date-all-delete").click(function (e) {
  fetch("http://localhost:8080/list/all", {
    method: "DELETE",
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      alert("목록에서 모두 삭제하였습니다");
      location.href = "http://localhost:8080/list";
    }
  });
});

//지도의 중심좌표 객체

if ($(".user-planner-card").length < 1) {
  var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.564214, 127.001699), // 지도의 중심좌표 설정
      level: 3, // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
} else {
  const center = {
    x: Number($(".user-planner-card .card-xy").children(".x").html()),
    y: Number($(".user-planner-card .card-xy").children(".y").html()),
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
  $(".user-planner-card").each(function (index) {
    // 장소의 x와 y좌표를 구함
    const LatLng = $(this)
      .children(".place-info")
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
        "<div>" +
        $(this).children(".place-info").children(".card-name").html() +
        "</div>", // 인포윈도우에 표시할 내용
    });

    $(this)
      .children(".place-info")
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

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  function makeOverListener(map, marker, infowindow, x, y) {
    return function () {
      if (prevInfoWindow != null) {
        prevInfoWindow.close();
      }
      prevInfoWindow = infowindow;
      setCenter(x, y);
      infowindow.open(map, marker);
    };
  }

  // 지도 중심을 부드럽게 이동시킵니다
  function setCenter(x, y) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(y, x);

    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
  }
}
