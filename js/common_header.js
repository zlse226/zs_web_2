

const menuItem = document.querySelectorAll(".menu-item");

// 추가: 메인해더 분리로 인해 이미지 경로 해결
// 기존 이미지 경로는 유지하고 파일명 변경으로
function changeIcon(image, fileName){
    image.src = new URL(fileName, image.src).href;
}

menuItem.forEach(function(item){
    // 이 안에서 item 이 생성되고 .menu-item안의 하나만 가져오기때문에
    const menuTitle = item.querySelector(".menu-title");
    menuTitle.addEventListener("click", function(){

        // 현재 클릭한 메뉴가 열려 있는지 확인
        if(item.classList.contains("active")){

            // 열려 있으면 닫기
            item.classList.remove("active");

            // 이미지가 없는 메뉴가 있으므로 넣어야함
            const arrow = item.querySelector(".menu-arrow-down");
            if(arrow){
                // arrow.src="image/icon/icon_arrow_down.png"
                changeIcon(arrow, "icon_arrow_down.png");
            }
        }
        else{
            menuItem.forEach(function(item){
                item.classList.remove("active");
                const arrow = item.querySelector(".menu-arrow-down");
                if(arrow){
                    // arrow.src = "image/icon/icon_arrow_down.png";
                    changeIcon(arrow, "icon_arrow_down.png");

                }
            });

            // 현재 메뉴판 열기
            item.classList.add("active");
            
            const activeArrow = item.querySelector(".menu-arrow-down");
            if(activeArrow){
                // activeArrow.src = "image/icon/icon_arrow_up.png";
                changeIcon(activeArrow, "icon_arrow_up.png");

            }
        }


    })
})

// notice-list 숨김 보임

const submenuNotice = document.querySelector(".submenu-notice");
const noticeList = document.querySelector(".notice-list");
const noticeIcon = document.querySelector(".submenu-notice-icon");

submenuNotice.addEventListener("click",function(){
    noticeList.classList.toggle("open");

    if(noticeList.classList.contains("open")){
        // noticeIcon.src = "image/icon/icon_minus.png"
        changeIcon(noticeIcon, "icon_minus.png");
    }else{
        // noticeIcon.src = "image/icon/icon_plus.png";
        changeIcon(noticeIcon, "icon_plus.png");
    }
});


// // parentselement 방식으로 해보기
// menuTitles.forEach(function(menuTitle){
//     menuTitle.addEventListener("click", function(){
//         menuItems.classList.remove("active");
//     })
//     menuItems.classList.add("active");
// })

/* gnb닫기면 con 열림 초기화 */
// 별도의 함수로 만들어 관리
function resetCon(){
    menuItem.forEach(function(item){
        item.classList.remove("active");

        const arrow = item.querySelector(".menu-arrow-down");
        if(arrow){
            // arrow.src = "image/icon/icon_arrow_down.png"
            changeIcon(arrow, "icon_arrow_down.png");
        }
    });
    noticeList.classList.remove("open");
    // noticeIcon.src = "image/icon/icon_arrow_plus.png";
    changeIcon(noticeIcon, "icon_plus.png")
}


const gnbContent = document.querySelector(".gnb-content");
const gnbClose = document.querySelector(".gnb-close");
const gnbOpen = document.querySelector(".gnb-open");
const gnbOverlay = document.querySelector(".gnb-overlay");

// resetCon()으로 인해 삭제된 영역
// gnbOpen.addEventListener("click", function(){
//     // gnbContent.classList.add("gnbactive");
//     // gnbOverlay.classList.add("gnbactive");
//     gnbOverlay.classList.add("gnbactive"); // 둘다 적용하던걸 부모 영역에 적용
// })

// gnbClose.addEventListener("click", function(){
//     // gnbContent.classList.remove("gnbactive")
//     // gnbOverlay.classList.remove("gnbactive");
//     gnbOverlay.classList.remove("gnbactive"); // 둘다 적용하던걸 부모 영역에 적용
//     resetCon(); // 초기화하는 함수 코드 추가

// });

// /* esc누르면 닫기기 */

// document.addEventListener("keydown", function(e){
//     if(e.key === "Escape"){
//         // gnbContent.classList.remove("gnbactive");
//         // gnbOverlay.classList.remove("gnbactive"); 
//         // // 두 개다 제거해줘야 오버레이 창이 닫김
//         gnbOverlay.classList.remove("gnbactive"); // 둘다 적용하던걸 부모 영역에 적용
//         resetCon(); // 초기화하는 함수 코드 추가
//     }
// })

// // 오버레이 영역 클릭시 창 닫기기
// gnbOverlay.addEventListener("click", function(){
//     // gnbContent.classList.remove("gnbactive");
//     // gnbOverlay.classList.remove("gnbactive");
//     gnbOverlay.classList.remove("gnbactive"); // 둘다 적용하던걸 부모 영역에 적용
//     resetCon(); // 초기화하는 함수 코드 추가

// })

// 오버레이 영역 클릭시 창 닫기기 .. 이벤트 전파를 막음

gnbContent.addEventListener("click", function(e){
    e.stopPropagation();
});

/* GNB 열려있을 때 분문 스크롤 막기 */
function openGnb(){
    gnbOverlay.classList.add("gnbactive");
    document.body.classList.add("menu-open"); // css에 적은 변수명
}

function closeGnb(){
    gnbOverlay.classList.remove("gnbactive");
    document.body.classList.remove("menu-open"); // css에 적은 변수명
    resetCon(); // 중복 삭제 후 추가
}

gnbOpen.addEventListener("click", openGnb);
gnbClose.addEventListener("click", closeGnb);
gnbOverlay.addEventListener("click", closeGnb);

document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        closeGnb();
    }
})


///////////////////////////// 스크롤시 탑 메늎

const siteHeader = document.querySelector("#site-header");

window.addEventListener("scroll", function(){
    if(window.scrollY > 50) {
        siteHeader.classList.add("scroll")
    }
    else{
        siteHeader.classList.remove("scroll");
    }
})




///////////////////////////// 모바일에서 검색아이콘 누르면 검색창뜨게
/////////////////검색아이콘 클릭 -> mobile-search에 open 클래스 toggle -> css의 .open 적용 -> 패널 내려옴

const mobileSearch = document.querySelector(".mobile-search");
const mobileSearchIcon = document.querySelector(".mobile-search-icon");

mobileSearchIcon.addEventListener("click", function(){
    
    if(window.innerWidth > 768) return /* 모바일너비(768px)보다 크면 아래코드 실행하지말고 끝내라 */

    if(mobileSearch.classList.contains("searchopen")){ // mobileopen이 있는가?
        mobileSearch.classList.remove("searchopen")  // 이미열려있음 -> 닫기
        siteHeader.classList.remove("searchopen") //  헤더도 하얀색으로 : 위쪽에서 선언한 siteHeader 사용
        // mobileSearchIcon.src = "image/icon/icon_search.svg" // 검색 아이콘
        changeIcon(mobileSearchIcon, "icon_search.svg");
    }
    else{
        mobileSearch.classList.add("searchopen")  // 닫혀있음 -> 열기
        siteHeader.classList.add("searchopen") //  헤더도 하얀색으로 : 위쪽에서 선언한 siteHeader 사용
        // mobileSearchIcon.src = "image/icon/icon_close_b.svg" // 닫기 아이콘
        changeIcon(mobileSearchIcon, "icon_close_b.svg");
    }
})