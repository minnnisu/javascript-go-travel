function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}
const placeID = searchParam("id");
const placeData = JSON.parse(localStorage.getItem(placeID));

$(".user-setting-data .memo").html(placeData["memo"]);
$(".user-setting-data .datetime").html(
  placeData["date"] + " " + placeData["time"]
);
