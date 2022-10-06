$("nav").css("height", window.innerHeight);

$(".travel-data-card .card-button .list-more").click(async function () {
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

  $("nav .right .stored-data .memo").html(""); //메모 태그 아래 자식 요소 제거

  $("nav .right .place-info .card-name").html(data["place_name"]);
  $("nav .right .place-info .card-name").attr("href", data["place_url"]);
  $("nav .right .place-info .card-address .value").html(
    data["road_address_name"]
  );
  $("nav .right .place-info .card-category .value").html(data["category_name"]);
  $("nav .right .place-info .card-phone .value").html(data["phone"]);
  $("nav .right .place-info .hidden-data .card-xy .x").html(data["x"]);
  $("nav .right .place-info .hidden-data .card-xy .x").html(data["x"]);
  $("nav .right .place-info .hidden-data .card-place-id").html(data["id"]);
  $("nav .right .stored-data .date").html(data["date"]);

  const modifiedMemo = data["memo"].replace(/\n/g, "<br />");
  console.log(modifiedMemo);
  $("nav .right .stored-data .memo").prepend(modifiedMemo);

  $("nav .right").show();
});

$(".material-icons.close-button").click(function () {
  $(".right").hide();
});

$("nav .right .data-control .list-delete").click(function () {
  const id = $("nav .right .place-info .hidden-data .card-place-id").html();
  fetch("http://localhost:8080/list?id=" + id, {
    method: "DELETE",
  }).then(() => {
    window.location.reload();
  });
});

$("nav .right .data-control .list-modify").click(function () {
  console.log("modify");
});

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
