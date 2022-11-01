$("nav").css("height", window.innerHeight);

//리스트에서 데이터 삭제
$("#modal .data-control .list-delete").click(function () {
  const id = $("#modal .place-info .hidden-data .card-place-id").html();
  fetch("http://localhost:8080/list?id=" + id, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      response.text().then((msg) => alert(msg));
    } else {
      response.text().then((msg) => {
        console.log(msg);
      });
      window.location.reload();
    }
  });
});

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

//여행 목록 추가 모달 켜짐
$(".travel-data-card .card-button .list-more").click(async function () {
  //get요청 시 보낼 변수들
  const element = $(this).parent().parent(".place-info");
  const placeId = element
    .children(".hidden-data")
    .children(".card-place-id")
    .html();
  const name = element.children(".card-name").html();
  const x = element
    .children(".hidden-data")
    .children(".card-xy")
    .children(".x")
    .html();
  const y = element
    .children(".hidden-data")
    .children(".card-xy")
    .children(".y")
    .html();

  //서버로 부터 정보를 가져옴
  const response = await fetch(
    "http://localhost:8080/list/info?id=" +
      placeId +
      "&name=" +
      name +
      "&x=" +
      x +
      "&y=" +
      y
  );
  if (!response.ok) {
    response.text().then((msg) => alert(msg));
    return;
  }
  const data = await response.json();
  console.log(data);

  $("#modal .stored-data .memo").html(""); //기존에 있던 메모 정보를 지움

  $("#modal .place-info .card-name").html(data["place_name"]);
  $("#modal .place-info .card-name").attr("href", data["place_url"]);
  $("#modal .place-info .card-address .value").html(data["road_address_name"]);
  $("#modal .place-info .card-category .value").html(data["category_name"]);
  $("#modal .place-info .card-phone .value").html(data["phone"]);
  $("#modal .place-info .hidden-data .card-xy .x").html(data["x"]);
  $("#modal .place-info .hidden-data .card-xy .x").html(data["x"]);
  $("#modal .place-info .hidden-data .card-place-id").html(data["id"]);
  $("#modal .stored-data .date").html(data["date"]);

  const modifiedMemo = data["memo"].replace(/\n/g, "<br />");
  console.log(modifiedMemo);
  $("#modal .stored-data .memo").prepend(modifiedMemo);

  modalOn($("#list-add-modal")); //모달 켜기
});
