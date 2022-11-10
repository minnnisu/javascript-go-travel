window.onload = () => {
  if (new URL(location.href).searchParams.get("loginError")) {
    alert(new URL(location.href).searchParams.get("loginError"));
  }
};

// 모달 켜기
function modalOn(modal) {
  modal.css("display", "flex");
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

//여행 목적지 변경
$(".my-destination").click(function () {
  modalOn($("#destination-input-modal")); //모달 켜기
});
