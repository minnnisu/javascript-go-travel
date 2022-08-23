// 태그 선택 시 관련 세부 태그 보이기
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

$(".list-button").click(function (e) {
  $("nav").toggle();
});

$(".header__destination-change").click(function (e) {
  fetch("http://localhost:8080/destination?query=true")
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {});
});

$(".section__page-item").click(function (e) {
  const page = $(this).attr("id");
  fetch("http://localhost:8080/place?page=" + page)
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {});
});

$(".section__item").click(function () {
  const id = $(this).children(".section__item-info").children("#id").html();
  fetch("http://localhost:8080/place/info?id=" + id)
    .then((result) => {
      window.location.reload();
    })
    .catch((err) => {});
});
