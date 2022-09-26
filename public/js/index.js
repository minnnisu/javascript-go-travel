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
      if (!response.ok) {
        response.text().then((msg) => alert(msg));
      }
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
    .catch((err) => {
      console.log(err);
    });
});

//여행 리스트 일부 삭제
$(".nav__list-item .delete-button").click(function (e) {
  fetch("http://localhost:8080/list?id=" + $(this).attr("id"), {
    method: "DELETE",
  }).then(() => {
    window.location.reload();
  });
});

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

$(".list__header-button-delete").click(function (e) {
  fetch("http://localhost:8080/list/all", {
    method: "DELETE",
  }).then(() => {
    window.location.reload();
  });
});
