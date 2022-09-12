//localStorage에 저장된 여행리스트 정보를 서버로 보냄
function refreshList() {
  const travelList = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    const value = JSON.parse(window.localStorage.getItem(key)); //자바스크립트 객체 형태로 변환

    travelList[i] = {
      id: key,
      name: value["name"],
      address: value["address"],
      category: value["category"],
      y: value["y"],
      x: value["x"],
      date: value["date"],
      time: value["time"],
      memo: value["memo"],
    };
  }

  console.log(travelList);

  fetch("http://localhost:8080/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(travelList),
  })
    .then((res) => {
      // if (res.status == "200") {
      //   //list 반영에 성공하였다면, 페이지 reload
      //   // window.location.reload();
      // }
      console.log(res.status);
    })
    .catch((err) => console.log(err));
}

window.onload = refreshList();

// 태그(식사, 관광, 수면) 선택 시 관련 세부 태그 출력
$(
  ".section__tag-big .meal, .section__tag-big .tourism, .section__tag-big .sleep"
).click(function (e) {
  const e_class = e.target.classList.value;
  const tagList = ["meal", "tourism", "sleep"];
  tagList.forEach((element) => {
    if (element != e_class) {
      $(".section__tag-middle." + element).hide();
    } else {
      $(".section__tag-middle." + element).show();
    }
  });
});

//여행리스트 목록 영역 toggle
$(".list-button").click(function (e) {
  $("nav").toggle();
});

//여행 목적지 변경
$(".header__destination-change").click(function (e) {
  fetch("http://localhost:8080/search/destination?query=true")
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {});
});

//페이지 전환
$(".section__page-item").click(function (e) {
  const page = $(this).html();
  fetch("http://localhost:8080/place?page=" + page)
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {});
});

//여행 리스트 일부 삭제
$(".nav__list-item .delete-button").click(function (e) {
  const targetID = $(this).attr("id");
  localStorage.removeItem(targetID);
  refreshList();
  window.location.reload();
});

$(".nav__list-item .more-button").click(function (e) {});

//리스트 추가 후 뒤로가기를 할 경우 reload가 안되므로 결과가 반영이 안됨
