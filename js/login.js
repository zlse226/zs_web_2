/////// [ 뒤로가기 버튼 ]
const backBtn = document.querySelector(".header-back");
console.log(backBtn);
backBtn.addEventListener("click",function(){
    console.log("뒤로가기클릭");
    history.back();
})

/////// [ login-tab ]
const tabBtns = document.querySelectorAll(".login-tab-btn");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

// 탭 버튼을 하나씩 가져와서 각각 클릭 이벤트 적용
tabBtns.forEach(function(btn, index){ // active클래스로 바꾸면서 index 추가
    // 탭버튼 클릭했을때 
    btn.addEventListener("click", function(){
        // 모든 버튼에서 active 제거
        // tabBtns는 전체묶음이라 한번더 forEach필요
        tabBtns.forEach(function(button){
            button.classList.remove("active");
        })
        // 내가 클릭한 버튼에만 active 추가
        btn.classList.add("active");
        
        // if(btn === tabBtns[0]){
        //     loginForm.style.display = "flex";
        //     signupForm.style.display = "none";
        // }
        // else{
        //     loginForm.style.display = "none";
        //     signupForm.style.display = "flex";
        // }
        // => sytle을 직접 변경하지 않고 active 클래스로 처리
        loginForm.classList.toggle("active", index === 0);
        signupForm.classList.toggle("active", index === 1);
    });

});

// 성별 열고 닫기
const selected = document.querySelector(".selected");
const genderList = document.querySelector(".gender-list");

selected.addEventListener("click", function(){

    const arrow = selected.querySelector("img")
    if(genderList.style.display === "block"){
        genderList.style.display = "none";
        changeIcon(arrow, "icon_arrow_down.svg")
    }
    else{
        genderList.style.display = "block";
        changeIcon(arrow, "icon_arrow_up.svg")


    }
});

// 성별 클릭시 유지
const genderItems = document.querySelectorAll(".gender-list li");
const selectedText = selected.querySelector("span");

genderItems.forEach(function(item){
    item.addEventListener("click", function(){
        selectedText.textContent = item.textContent; // 선택한 글자로 변경
        genderList.style.display = "none"; // 목록닫기

        const arrow = selected.querySelector("img");
        changeIcon(arrow, "icon_arrow_down.svg"); // 화살표도 닫힘상태
    })
})



/////// [ 유효성 검사 ]
// 1. 검사 성공'실패 화면 처리 함수
// 2. 입력 종류별 검사 함수
// 3. 폼 제출 시 검사 실행
// 4. 사용자가 다시 입력하면 오류 제거
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규식 ("문자열@문자열.문자열" 인지 검사)
const phonePattern = /^01[016789]\d{7,8}$/; // 핸드폰 번호 형식 (010-1234-5678 or 01012345678 가능)
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/; // 영문과 숫자를 각가 하나 이상 포함한 8~20자
const namePattern = /^[가-힣a-zA-Z\s]{2,30}$/; // 한글 또는 영문과 공백만 허용하는 2~30자 이름

// 에러표시: 검사에 실패한 input과 출력할 메세지를 전달 받음
function showError(input, message) {  // input: 오류를 표시할 실제 "input"요소를 전달 받는 매개변수
    const inputField = input.closest(".input-field"); // 검사할 input에서 위쪽부모요소를 따라 올라가 가장 가까운 .input-field를 찾음
    const errorElement = inputField.querySelector(".input-error"); // 방금 찾은 .input-field안에서 오류를 출력한 .input-error를 찾음

    input.classList.add("input-invalid"); // 빨간 테두리 클래스css 추가
    errorElement.textContent = message; // 오류 문구 입력
}
// 에러 제거: showError와 반대로 동작
function clearError(input) {
    const inputField = input.closest(".input-field");
    const errorElement = inputField.querySelector(".input-error");

    input.classList.remove("input-invalid"); // 빨간 테두리 클래스css제거
    errorElement.textContent = ""; // 출력된 에러 메시지를 빈 문자열로 변경
}

// 이메일 검사
function validateEmail(input) {
    const value = input.value.trim(); // input.value: 사용자가 입력한 값을 가져옴, trim(): 문자열 앞뒤의 공백 제거

    //  아무것도 입력하지 않은 경우
    if (value === "") {  // 값이 비어있으면
        showError(input, "이메일을 입력해주세요."); // 에러를 표시하고
        return false; // false를 반환
    }

    // 이메일 형식이 아닌 경우
    // 입력잘함 -> emailPattern.test(value) = true -> !emailPattern.test(value) = fasle -> 에러문구X
    // 입력실패 -> emailPattern.test(value) = false -> !emailPattern.test(value) = true -> 에러문구O
    if (!emailPattern.test(value)) { // 값이 정규식과 일치하는지 확인
        showError(input, "이메일 형식이 아닙니다."); // 이메일 호출 에레 예시
        return false;
    }

    clearError(input);
    return true;
}

// 비밀번호 검사
function validatePassword(input) { // trim()을 사용하지않음 -> 사용자가 입력한 공백도 실제 비밀번호로 취급하기 위함
    const value = input.value;

    // 비어있다면 실패
    if (value === "") {
        showError(input, "비밀번호를 입력해주세요.");
        return false;
    }

    // 조건 만족하지 않으면 실패
    if (!passwordPattern.test(value)) {
        showError(
            input,
            "비밀번호는 영문과 숫자를 포함한 8~20자여야 합니다."
        );
        return false;
    }

    clearError(input);
    return true;
}

// 이름 검사
function validateName(input) {
    const value = input.value.trim();

    if (value === "") {
        showError(input, "이름을 입력해주세요.");
        return false;
    }

    if (!namePattern.test(value)) {
        showError(input, "이름은 한글 또는 영문 2~30자로 입력해주세요.");
        return false;
    }

    clearError(input);
    return true;
}

// 핸드폰 번호 검사
function validatePhone(input) {
    const value = input.value.trim().replaceAll("-", ""); // replaseAll("-", ""): 모든 하이픈 제거

    if (value === "") {
        showError(input, "핸드폰 번호를 입력해주세요.");
        return false;
    }

    if (!phonePattern.test(value)) {
        showError(input, "올바른 핸드폰 번호를 입력해주세요.");
        return false;
    }

    clearError(input);
    return true;
}

/////// 로그인 폼 제출
// type="submit": 이 버튼을 클릭하면 해당 요소가 포함되어 있는 form태그로 나타내는 양식의 모든 컨트롤의 값을 제출
loginForm.addEventListener("submit", function (event) { // 로그인 버튼이 type="submit"이면 클릭했을때 폼의 이벤트가 발생
    event.preventDefault(); // 폼이 제출되면 기본적으로 페이지가 새로고침되는데 이를 막아서 javaScript검사를 먼저 실행

    // loginForm 내부에서 각각 요소를 찾음 (loginForm을 햇을때문에s signupForm에서는 같은 요소가 있어도 찾지않음)
    const emailInput = loginForm.querySelector('[name="email"]'); // emailinput: 이메일 input 요소
    const passwordInput = loginForm.querySelector('[name="password"]');

    // 입력값 검사: 각 함수의 반환값이 변수에 저장
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput);

    // 모든 검사를 통과했는지 확인
    if (isEmailValid && isPasswordValid) { // 두 조건이 모두 참일때 
        console.log("로그인 유효성 검사 통과"); // 반환

        // 이곳에서 서버로 로그인 정보를 전송합니다.
    }
});

/////// 계정생성 폼 제출
signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = signupForm.querySelector('[name="name"]');
    const emailInput = signupForm.querySelector('[name="email"]');
    const phoneInput = signupForm.querySelector('[name="phone"]');
    const passwordInput = signupForm.querySelector('[name="password"]');

    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPhoneValid = validatePhone(phoneInput);
    const isPasswordValid = validatePassword(passwordInput);

    const signupMessage = document.querySelector(".signup-message");

    if (
        isNameValid &&
        isEmailValid &&
        isPhoneValid &&
        isPasswordValid
    ) {
        // console.log("회원가입 유효성 검사 통과");
        // alert("회원가입 유효성 검사 통과");
        signupMessage.classList.add("show");
        setTimeout(function(){
            signupMessage.classList.remove("show");
        }, 2000);
        // 이곳에서 서버로 회원가입 정보를 전송합니다.
    }

});

// 입력을 다시 시작하면 해당 입력란의 에러 제거
document
    .querySelectorAll(".login-input, .signup-input") // 두 요소 모두선택
    .forEach(function (input) { // 선택된 input을 하나씩 가져옴
        input.addEventListener("input", function () { // 사용자가 글자를 입력하거나 삭제할때마다 실행
            clearError(input); // 입력중인 input의 빨간테두리와 에러메시지 모두 삭제
        });
    });


/////// [ 비밀번호 show/none ]
const passwordInput = document.querySelector('input[name="password"]')
const passwordToggle = document.querySelector(".password-toggle");
const passwordIcon = passwordToggle.querySelector("img");

passwordToggle.addEventListener("click", function(){
    if(passwordInput.type === "password"){
        // 비밀번호 보이기
        passwordInput.type = "text";

        passwordIcon.src = new URL( // passwordIcon.src: 아래에서 바꾼 새로운 주소를 저장할 변수
            "icon_eye.svg", passwordIcon.src // passwordIcon.src: 바꾼 이미지 주소를 기준으로 함
        ).href; // href: 만들어진 주소를 실제 문자열 주소로 꺼냅니다
        passwordToggle.setAttribute( // setAttribute: HTML요소의 속성을 추가하거나 변경하는 JavaScript 메서드
            "aria-label", "비밀번호 숨기기"
        );
    } else{
        // 비밀번호 숨기기
        passwordInput.type = "password";

        passwordIcon.src = new URL(
            "icon_eye-off.svg", passwordIcon.src
        ).href;
        passwordToggle.setAttribute(
            "aria-label", "비밀번호 보기"
        );
    }
});