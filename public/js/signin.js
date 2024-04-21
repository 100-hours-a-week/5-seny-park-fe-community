import {
  handleSelected,
  ProfileImgCheck,
  emailCheck,
  pwdCheck,
  pwdCheckSame,
  nicknameCheck,
} from "/js/utils.js";

const formEl = document.querySelector("#signin-form");
// 회원가입 이미지 업로드
const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
const redImgEl = document.querySelector(".red.img"); // 이미지 업로드 경고문
// const reader = new FileReader(); // 파일 읽기 객체
// 회원가입 텍스트 폼 유효성 검사
const pwdEl = document.querySelector("#password");
const redEmailEl = document.querySelector(".red.email");
const redPwdEl = document.querySelector(".red.pwd");
const redPwdCheckEl = document.querySelector(".red.pwd-check");
const redNicknameEl = document.querySelector(".red.nickname");
// 회원가입 버튼
const signinBtn = document.querySelector(".inner .btn");

// 이미지 업로드
fileInput.addEventListener("change", () => {
  handleSelected(fileInput, imgPrevEl, redImgEl);
});

// 회원가입 텍스트 폼 유효성 검사
let check = {
  profileImagePath: false,
  email: false,
  password: false,
  checkPassword: false,
  nickname: false,
};

// fetch로 json 파일 불러오기
const users = [];
fetch("/json/users.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((user) => {
      users.push({ email: user.email, nickname: user.nickname });
    });
    console.log(users);
  });

formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    check.email = emailCheck(event.target.value, redEmailEl);
  }
  if (event.target.id === "password") {
    check.password = pwdCheck(event.target.value, redPwdEl);
  }
  if (event.target.id === "checkPassword") {
    check.checkPassword = pwdCheckSame(
      pwdEl.value,
      event.target.value,
      redPwdCheckEl
    );
  }
  if (event.target.id === "nickname") {
    check.nickname = nicknameCheck(event.target.value, redNicknameEl);
  }
  if (
    check.profileImagePath &&
    check.email &&
    check.password &&
    check.checkPassword &&
    check.nickname
  ) {
    // formEl.submit();
    console.log(
      formEl.elements.email.value,
      formEl.elements.password.value,
      formEl.elements.nickname.value
    );
    signinBtn.classList.add("active");
  } else {
    signinBtn.classList.remove("active");
  }
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  check.profileImagePath = ProfileImgCheck(imgPrevEl, redImgEl);
  check.email = emailCheck(formEl.elements.email.value, redEmailEl);
  check.password = pwdCheck(pwdEl.value, redPwdEl);
  check.checkPassword = pwdCheckSame(
    pwdEl.value,
    formEl.elements.checkPassword.value,
    redPwdCheckEl
  );
  check.nickname = nicknameCheck(formEl.elements.nickname.value, redNicknameEl);

  if (
    check.profileImagePath &&
    check.email &&
    check.password &&
    check.checkPassword &&
    check.nickname
  ) {
    let emailExist = users.find(
      (user) => user.email == formEl.elements.email.value
    );
    let nicknameExist = users.find(
      (user) => user.nickname == formEl.elements.nickname.value
    );
    if (emailExist || nicknameExist) {
      if (emailExist) {
        redEmailEl.textContent = "중복된 이메일입니다.";
      }
      if (nicknameExist) {
        redNicknameEl.textContent = "중복된 닉네임입니다.";
      }
    } else {
      formEl.submit();
    }
  }
});
