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

$(".button").click(function (e) {
  axios({
    method: "get",
    url: "/search",
  }).then(function (response) {
    console.log(response);
  });
});
