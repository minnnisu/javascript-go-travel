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

// $(".nav__list-item .delete-button").click(function (e) {
//   const targetID = $(this).attr("id");
//   localStorage.removeItem(targetID);
//   refreshList();
//   window.location.reload();
// });

$(".nav__list-item .more-button").click(function (e) {});

//여행리스트 노드 생성
window.onload = function () {
  for (let i = 0; i < window.localStorage.length; i++) {
    // key 찾기
    const key = window.localStorage.key(i);
    // value 찾기
    const value = JSON.parse(window.localStorage.getItem(key));

    const listItemTag = $("<div></div>");
    listItemTag.attr("class", "nav__list-item");

    $(".nav__list-container").append(listItemTag);

    const placeNameTag = $("<a>" + value["name"] + "</a>");
    placeNameTag.attr("class", "name");
    placeNameTag.attr("href", "/place" + value["link"].slice(27));

    const dateTimeTag = $(
      "<div>" + value["date"] + " " + value["time"] + "</div>"
    );
    dateTimeTag.attr("class", "date-time");

    const addressTag = $("<div>" + value["address"] + "</div>");
    addressTag.attr("class", "address");

    const moreButton = $("<button>" + "자세히보기" + "</button>");
    moreButton.attr("class", "more-button");
    moreButton.attr("href", "/list/info" + value["link"].slice(27));

    const modifyButton = $("<button>" + "수정" + "</button>");
    modifyButton.attr("class", "modify-button");

    const deleteButton = $("<button>" + "삭제" + "</button>");
    deleteButton.attr("class", "delete-button");
    deleteButton.attr("id", value["id"]);
    // deleteButton.attr("onclick", "deleteListElement");

    listItemTag.append(placeNameTag);
    listItemTag.append(dateTimeTag);
    listItemTag.append(addressTag);
    listItemTag.append(moreButton);
    listItemTag.append(modifyButton);
    listItemTag.append(deleteButton);
  }
};

//여행 리스트 일부 삭제
$(".delete-button").click(function (e) {
  $(this).attr("id");
  // console.log(1);
  // const targetID = $(this).attr("id");
  // localStorage.removeItem(targetID);
});

// function deleteListElement() {
//   console.log(e.target);
//   const targetID = $(this).attr("id");
//   localStorage.removeItem(targetID);
// }
