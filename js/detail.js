// 2번 흐름
// categoryBtn
// → [DOJACAT, ALL, LIP, FACE, EYE ...]

//                     ↓ 하나씩 이벤트 등록

// FACE 클릭
// → 이때 btn = FACE 버튼

// btn.classList.add("active")
// → FACE에 active 추가

// 3번 흐름
// LIP 버튼 클릭
// ↓
// category = "lip"

// 상품을 하나씩 검사

// 1번 상품 → item → data-category="lip"
// "lip" === "lip"
// → item에 active 추가

// 2번 상품 → item → data-category="face"
// "lip" === "face"
// → item에서 active 제거

// 3번 상품 → item → data-category="lip"
// "lip" === "lip"
// → item에 active 추가

const categoryBtns = document.querySelectorAll(".category-btn");
const productItems = document.querySelectorAll(".product-item");
const productCount = document.querySelector(".product-count span");

categoryBtns.forEach(function(btn){ // btn: 하나씩 꺼내진 버튼
    btn.addEventListener("click", function(){
        const category = btn.dataset.category;

        // 1. 모든 버튼 제거
        // 여러개여서 한번에 못하고 forEach해야함
        categoryBtns.forEach(function(button){
            button.classList.remove("active");
        });
        // 2. 클릭한 버튼 active 추가
        btn.classList.add("active");

        // 3. 상품 확인 준비 + count 초기화
        let count = 0;
        // 4. 상품을 검사하면서 count 증가
        //    all이면 전부 보이기
        //    아니면 같은 category만 보이기
        productItems.forEach(function(item){ // productItems: 상품 전체 묶음, item: 하나의 상품
            const itemCategory = item.dataset.category; // 각 상품의 카테고리 가져오기
            if(category === "all" || category === itemCategory){ // 둘 중 하나만 true어도 상품 표시
                item.classList.add("active");
                count++; // 4, 일치하는 상품이 나올때마다 +1
            }
            else{
                item.classList.remove("active")
            }
        });
        productCount.textContent = count;
    })
})
// // 페이지 처음 들어왔을때 all 탭 자동 선택
// document.querySelector('[data-category="all"]').click();
// 주소에서 category 값 가져오기
const params = new URLSearchParams(window.location.search); //window.location.search는 주소에서 "?"" 뒤를 가져온다
const category = params.get("category");

if(category){
    document.querySelector(`[data-category="${category}"]`).click();
}
else{ // detail.html로 들어오면 결과가 null이 되므로 all탭으로 들어오게
    document.querySelector('[data-category="all"]').click();
}



/////////// 하트 onoff
// heart-btn 여러개 가져오기 -> 각각 클릭 -> 현재 좋아요 상태 확인 -> 이미지 src 변경
const heartBtns = document.querySelectorAll(".heart-btn");

heartBtns.forEach(function(heartBtn){
    const heartImg = heartBtn.querySelector("img"); // 버튼 안의 이미지
    let isFull = true;

    heartBtn.addEventListener("click", function(){
        if(isFull){
            // 현재 빨간 하트니까 -> 빈하트로 변경
            isFull = false;
            heartImg.src = "../image/icon/icon_heart.svg";
        }
        else{
            // 현재 빈 하트니까 -> 빨간 하트로 변경
            isFull = true;
            heartImg.src = "../image/icon/icon_heart_full.svg";
        }
    });
});

// /////////// 장바구니 on/off
// // cart-btn 여러 개 가져오기 -> 클릭 -> cartCount 숫자 + 1 -> 메시지 표시 -> 잠시 후 메세지 숨김
const cartBtns = document.querySelectorAll(".cart-btn");
const cartCountText = document.querySelector(".cart-count");
const cartMessage = document.querySelector(".cart-message");

// let cartCount = 0;

// cartBtns.forEach(function(cartBtn){
//     cartBtn.addEventListener("click", function(){
//         cartCount++;
//         cartCountText.textContent = cartCount; // 화면의 숫자 변경

//         // 장바구니 창 띄우기
//         cartMessage.classList.add("show");

//         setTimeout(function(){
//             cartMessage.classList.remove("show");
//         },1000);
//     });
// });

// 장바구니 on/off 주석하고 상품을 장바구니에 저장하는것 구현
// 저장된 장바구니 가져오기
function getCartItems(){
    const savedCart = localStorage.getItem("cartItems");
    if(savedCart){
        return JSON.parse(savedCart);
    }
    return[];
}

// 장바구니 저장
function saveCartItems(cartItems){
    localStorage.setItem(
        "cartItems", JSON.stringify(cartItems)
    );
}

// 헤더의 장바구니 숫자 표시
function updateCartCount(){
    const cartItems = getCartItems();
    let totalQuantity = 0;
    cartItems.forEach(function(item){
        totalQuantity += item.quantity;
    })
    cartCountText.textContent = totalQuantity;
}

cartBtns.forEach(function(cartBtn){
    cartBtn.addEventListener("click", function(){
        // 클릭한 장바구니 버튼의 상품 전체 찾기
        const productItem = cartBtn.closest(".product-item");

        // 상품명가져오기
        const productName = productItem
        .querySelector(".info-title")
        .textContent.trim();

        // 상품 가격 가져오기
        const priceText = productItem
        .querySelector(".info-price")
        .textContent;
        // ₩, 쉼표 등을 제거하고 숫자로 변환
        const productPrice = Number(
        priceText.replace(/[^0-9]/g, "")
    );
        // 상품이미지 가져오기
        const productImage = productItem
        .querySelector(".product-img-front")
        .src;

        const cartItems = getCartItems();

        // 같은 상품이 이미 장바구니에 있는지 확인
        const existingItem = cartItems.find(function (item) {
        return item.name === productName;
    });
        if (existingItem) {
            // 이미 있으면 수량만 증가
            existingItem.quantity++;
            } else {
            // 처음 담는 상품이면 새로 추가
            cartItems.push({
                name: productName,
                price: productPrice,
                image: productImage,
                option: "옵션 미선택",
                quantity: 1
            });
        }
        saveCartItems(cartItems);
        updateCartCount();

        // 기존 장바구니 알림 표시
        cartMessage.classList.add("show");

        setTimeout(function () {
        cartMessage.classList.remove("show");
        }, 1000);

    });
});
// 페이지를 열었을 때 기존 장바구니 개수 표시
updateCartCount();
