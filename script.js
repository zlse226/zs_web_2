// 1. banner-slide, banner, ctrl-bar-play, ctrl-btn을 선택한다.
// 2. 현재 슬라이드 번호를 저장할 변수 currentIndex = 0을 만든다.
// 3. 총 슬라이드 개수는 banners.length로 구한다.
// 4. 일정 시간마다 currentIndex를 1씩 증가시킨다.
// 5. 마지막 슬라이드 이후에는 다시 0으로 만든다.
// 6. .banner-slide에 transform: translateX(-현재번호 * 100%)를 준다.
// 7. 진행바는 현재 슬라이드 번호에 따라 width를 바꾼다.

// const slider = document.querySelector(".banner-slide");
// const banner = document.querySelectorAll(".banner");
// const ctrlBtn = document.querySelector(".ctrl-btn");

// currentIndex = 0

// function showBanner (){
//     currentIndex++;  // 다음 슬라이드 번호로 증가
//     if(currentIndex >= banner.length){ // 마지막 번호를 넘겼는지 검사
//         currentIndex = 0;
//     }
//     slider.style.transform = "translateX(" + currentIndex * -100 + "%)"; // 이동
// }
// setInterval(showBanner, 5000);

////////////////////////////////////////////
// 1. 모든 banner에서 active 제거
// 2. 현재 index의 banner에 active 추가
// 3. 진행바 상태 변경
// 4. currentIndex 증가
// 5. 마지막이면 0으로 돌리기
// 6. setInterval로 반복

const banners = document.querySelectorAll('.banner');
const ctrlBtn = document.querySelector('.ctrl-btn');
const ctrlBarPlay = document.querySelector('.ctrl-bar-play');
const ctrlIcon = document.querySelector('.ctrl-icon');

let currentIndex = 0;
let timer; // 자동재생
let isPlaying = true; // 자동재생중인지 확인


function showBanner(){
    banners.forEach(function(banner){
        banner.classList.remove('active');
    });
    banners[currentIndex].classList.add('active');
    updateBar(); // 배너가 바뀜과 동시에 bar가 진행되야하므로 showBanner안에서 호출
}
showBanner();

function nextBanner(){
    currentIndex++;
    
    if(currentIndex >= banners.length){
        currentIndex = 0;
    }
    showBanner();
} 
// timer = setInterval(nextBanner, 5000);  // setInterval을 timer에 저장해야 멈춤이 가능

// 수정 코드
function startBanner(){
    timer = setInterval(nextBanner, 5000);
}
function stopBanner(){
    clearInterval(timer);
}
startBanner(); // 추가 변경 코드 :  timer = setInterval(nextBanner, 5000);
// 

function updateBar(){
    ctrlBarPlay.style.width = ((currentIndex + 1) / banners.length) * 100 + "%"
}

ctrlBtn.addEventListener("click", function(){
    if(isPlaying){ // " isPlaying " == " isPlaying === true "
        stopBanner(); // 추가 변경 코드 : clearInterval(timer) 대신 함수로 사용
        isPlaying = false; //  clearInterval이 실행되면 isPlaying도 멈춤이 되야함
        ctrlIcon.src = "image/icon/icon_play.svg";
    }
    else{
        startBanner();
        isPlaying = true;
        ctrlIcon.src = "image/icon/icon_pause.svg";
    }
})


//////////////////////////  하단배너 (dot)

const bottomBanner = document.querySelector('.promotion-banner-content');
const dots = document.querySelectorAll('.dot')

let bottomIndex = 0; // n번째 배너를 보여줄지 저장하는 변수

// 현재 번호를 화면에 보여주는 함수 : 현재 bottomIndex를 봄 -> 배너 이동 -> dot active 변경
function proBanner(){ 
    bottomBanner.style.transform = "translateX(" + bottomIndex * -100 + "%)";

    dots.forEach(function(dot){
        dot.classList.remove("active");
    });
    dots[bottomIndex].classList.add("active");
}

// 번호를 바꿔서 화면에 호출하여 보여주는 함수 : 
// bottomIndex = 1 -> bottomIndex++ -> bottomIndex = 2 -> proBanner() -> 배너이동 -> dot 변경
function proNextBanner(){
    bottomIndex++;
    if(bottomIndex >= dots.length){
        bottomIndex = 0;
    }
    proBanner();
}
// setInterval(proNextBanner, 5000); // 삭제하고 수정코드

// 추가 (dot 클릭시 해당 배너로 이동)
let bottomTimer = setInterval(proNextBanner, 5000); // 수정 코드

dots.forEach(function(dot, index){
    dot.addEventListener("click", function(){
        bottomIndex = index;
        proBanner();

        // 수정 코드
        clearInterval(bottomTimer);
        bottomTimer = setInterval(proNextBanner, 5000);
    })
})