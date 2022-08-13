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

$(".header__more").click(function (e) {
  $("nav").show();
});

$(".nav__menu-close").click(function (e) {
  $("nav").hide();
});
