const qureyString = new URLSearchParams(location.search);
const LatLng_x = Number(qureyString.get("x"));
const LatLng_y = Number(qureyString.get("y"));

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(LatLng_y, LatLng_x), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(LatLng_y, LatLng_x);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

//슬라이드 이미지 설정
$(document).ready(async function () {
  const placeId = $(".hidden-data").children(".card-place-id").html();
  await fetch("http://localhost:8080/place/img?placeId=" + placeId).then(
    async (response) => {
      if (!response.ok) {
        response.text().then((msg) => console.log(msg));
        for (let i = 0; i < 5; i++) {
          const errMessageTag = $(
            '<div class="err-image-box"><img src="/image/err-img.png" width=180 height=180></img><span class="err-message">이미지가 없습니다</span></div>'
          );
          $(".slide_item.item" + (i + 1)).append(errMessageTag);
        }
      } else {
        const imgData = await response.json();
        for (let i = 0; i < imgData.length; i++) {
          const childrenTag = $("<img src=" + imgData[i] + "></img>");
          $(".slide_item.item" + (i + 1)).append(childrenTag);
        }
      }
    }
  );
});

$("#view-modify").click(function (e) {
  $("#list-modify-form .memo textarea[name=memo]").val(
    $("#user-data-form .memo .value").html()
  );
  $("#user-data-form").toggle();
  $("#list-modify-form").toggle();
});

//여행 목록에 추가
$("#data-create").click(function () {
  if (
    $("#list-add-form input[name=date]").val() == "" ||
    $("#list-add-form input[name=time]").val() == ""
  ) {
    return alert("여행기간이 선택하세요");
  }

  const placeId = $(".place-info .hidden-data .card-place-id").html();
  const name = $(".place-info .name").html();
  const x = $(".place-info .hidden-data .card-xy .x").html();
  const y = $(".place-info .hidden-data .card-xy .y").html();

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
      alert("목록에서 추가하였습니다");
      location.href = "http://localhost:8080";
    }
  });
});

//여행 목록 수정
$("#data-modify").click(function () {
  if (
    $("#list-modify-form input[name=date]").val() == "" ||
    $("#list-modify-form input[name=time]").val() == ""
  ) {
    return alert("여행기간이 선택하세요");
  }

  const placeId = $(".place-info .hidden-data .card-place-id").html();
  const name = $(".place-info .name").html();

  // 데이터베이스에 사용자의 여행리스트 추가
  fetch("http://localhost:8080/list", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: placeId,
      name: name,
      date: $("#list-modify-form input[name=date]").val(),
      time: $("#list-modify-form input[name=time]").val(),
      memo: $("#list-modify-form textarea[name=memo]").val(),
    }),
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      alert("수정했습니다");
      location.href = "http://localhost:8080/list";
    }
  });
});

//여행 목록에서 삭제
$("#data-delete").click(function (e) {
  const placeId = $(".place-info .hidden-data .card-place-id").html();
  fetch("http://localhost:8080/list?placeId=" + placeId, {
    method: "DELETE",
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      alert("목록에서 삭제하였습니다");
      location.href = "http://localhost:8080/list";
    }
  });
});
