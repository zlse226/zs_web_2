

// 빈 장바구니 화면
// const cartEmpty = document.querySelector(".cart-empty");
// const cartItems = document.querySelectorAll(".cart-item");

// if(cartItems.length === 0){
//     // 상품이 하나도 없으면 문구 표시
//     cartEmpty.style.display = "flex";
// } else{
//     // 상품이 있으면 문구 숨김
//     cartEmpty.style.display = "none";
// }


// 기존 빈장바구니 화면 주석처리 후 
/////////// ✅ 저장된 상품을 장바구니에 표시
const cartEmpty = document.querySelector(".cart-empty");
const cartItemsContainer = document.querySelector(".cart-items");

// 헤더 장바구니 카운트
const cartCountText = document.querySelector(".cart-count");

// 결제금액 표시 요소
const summaryProduct = document.querySelector(".summary-product");
const summaryDiscount = document.querySelector(".summary-discount");
const summaryDelivery = document.querySelector(".summary-delivery");

// 총 결제금액
const summaryTotal = document.querySelector(".summary-total");

// 전체선택 체크박스
const selectAllCheckbox = document.querySelector(".select-all-checkbox");

// 선택제품 삭제 버튼
const deleteSelectedButton = document.querySelector(".cart-delete-select");

function getCartItems() {
  const savedCart = localStorage.getItem("cartItems");

  if (savedCart) {
    return JSON.parse(savedCart);
  }

  return [];
}
// 변경된 장바구니 다시 저장
function saveCartItems(cartItems){
    localStorage.setItem(
        "cartItems",
        JSON.stringify(cartItems)
    );
}

function formatPrice(price) {
  return "₩ " + price.toLocaleString("ko-KR");
}

// [상품금액, 할인금액, 배송비 계산]
function updateSummary(cartItems) {
  let productTotal = 0;
  let totalQuantity = 0;

  cartItems.forEach(function (item) {
    // 상품 가격 × 수량
    productTotal += item.price * item.quantity;

    // 전체 상품 수량
    totalQuantity += item.quantity;
  });

  // 총 상품금액의 10% 할인
  const discount = Math.floor(productTotal * 0.1);

  // 상품이 없으면 배송비 0원
  // 총수량 3개 이상이면 무료배송
  // 총수량 3개 미만이면 3,000원
  let delivery = 0;

  if (totalQuantity === 0) {
    delivery = 0;
  } else if (totalQuantity >= 3) {
    delivery = 0;
  } else {
    delivery = 3000;
  }

  // 총 결제금액 = 총 상품금액 - 10% 할인금액 + 배송비
  const paymentTotal =
  productTotal - discount + delivery;

  summaryProduct.textContent = formatPrice(productTotal);
  summaryDiscount.textContent = "- " + formatPrice(discount);
  summaryDelivery.textContent = formatPrice(delivery);

  summaryTotal.textContent = formatPrice(paymentTotal);

  cartCountText.textContent = totalQuantity;

}

// [개별 상품 삭제]
cartItemsContainer.addEventListener("click", function (event) {
  // 클릭한 곳이 삭제 버튼 또는 삭제 버튼 안의 이미지인지 확인
  const removeButton = event.target.closest(
    ".cart-item-remove"
  );

  // 삭제 버튼을 클릭한 게 아니면 종료
  if (!removeButton) return;

  // 클릭한 삭제 버튼이 들어 있는 상품 찾기
  const cartItem = removeButton.closest(".cart-item");

  // 해당 상품의 번호 가져오기
  const index = Number(cartItem.dataset.index);

  // 저장된 장바구니 가져오기
  const cartItems = getCartItems();

  // 해당 번호의 상품 1개 삭제
  cartItems.splice(index, 1);

  // 삭제된 결과 저장
  saveCartItems(cartItems);

  // 화면 다시 출력
  renderCartItems();
});

// [상품별 수량 증가·감소]
cartItemsContainer.addEventListener("click", function (event) {
  const plusButton = event.target.closest(".quantity-plus");
  const minusButton = event.target.closest(".quantity-minus");

  // 수량 버튼을 클릭한 게 아니면 종료
  if (!plusButton && !minusButton) {
    return;
  }

  const cartItem = event.target.closest(".cart-item");
  const index = Number(cartItem.dataset.index);
  const cartItems = getCartItems();

  if (plusButton) {
    // + 버튼이면 수량 증가
    cartItems[index].quantity++;
  }

  if (minusButton && cartItems[index].quantity > 1) {
    // - 버튼이고 수량이 1보다 클 때만 감소
    cartItems[index].quantity--;
  }

  saveCartItems(cartItems);
  renderCartItems();
});

// [개별 상품 체크박스]
cartItemsContainer.addEventListener("change", function (event) {
  // 상품 체크박스가 아니면 종료
  if (!event.target.classList.contains("item-checkbox")) {
    return;
  }

  // 체크한 상품 찾기
  const cartItem = event.target.closest(".cart-item");

  // 상품 번호 가져오기
  const index = Number(cartItem.dataset.index);

  const cartItems = getCartItems();

  // 체크 상태 저장
  cartItems[index].checked = event.target.checked;

  saveCartItems(cartItems);
  renderCartItems();
});

// [전체선택 체크박스]
selectAllCheckbox.addEventListener("change", function () {
  const cartItems = getCartItems();

  cartItems.forEach(function (item) {
    // 전체선택 상태를 각 상품에 적용
    item.checked = selectAllCheckbox.checked;
  });

  saveCartItems(cartItems);
  renderCartItems();
});

// [선택한 상품 모두 삭제]
deleteSelectedButton.addEventListener("click", function () {
  const cartItems = getCartItems();

  // 체크되지 않은 상품만 남기기
  const remainingItems = cartItems.filter(function (item) {
    return item.checked !== true;
  });

  saveCartItems(remainingItems);
  renderCartItems();
});


function renderCartItems() {
  const cartItems = getCartItems();

  // 상품이 바뀔 때마다 금액 다시 계산
  updateSummary(cartItems);

  // 기존 출력 내용 초기화
  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    // 상품이 없으면 빈 장바구니 표시
    cartEmpty.style.display = "flex";

    // 상품이 없으면 전체선택 해제
    selectAllCheckbox.checked = false;

    return;
  }

  // 상품이 있으면 빈 장바구니 숨김
  cartEmpty.style.display = "none";

  cartItems.forEach(function (item, index) {
    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";
    cartItem.dataset.index = index; // <div class="cart-item" data-index="0~~"> 이런 상태가됨

    cartItem.innerHTML = `
      <div class="left-cont">
        <label class="cart-item-check">
          <input type="checkbox" class="item-checkbox" ${item.checked ? "checked" : ""}>
        </label>

        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
      </div>

      <div class="right-cont">
        <div class="cont-top">
          <div class="cart-item-name">
            ${item.name}
          </div>

          <button type="button" class="cart-item-remove">
            <img
              src="../image/icon/icon_close_b.svg"
              alt="상품 삭제"
            >
          </button>
        </div>

        <div class="cont-center">
          <div class="cart-item-option">
            <span class="option-value">
              옵션:
              <span class="selected-option">
                ${item.option}
              </span>

              <button type="button" class="option-change">
                옵션변경
              </button>
              <ul class="option-list">
                <li>01 심장폭격</li>
                <li>02 만찢코랄</li>
                <li>03 레드맛집</li>
              </ul>
            </span>
          </div>
        </div>

        <div class="cont-bottom">
          <div class="cart-price">
            ${formatPrice(item.price * item.quantity)}
          </div>

          <div class="cart-quantity">
            <button type="button" class="quantity-minus">
              <img
                src="../image/icon/icon_minus_b.svg"
                alt="수량 감소"
              >
            </button>

            <span class="quantity-value">
              ${item.quantity}
            </span>

            <button type="button" class="quantity-plus">
              <img
                src="../image/icon/icon_plus_b.svg"
                alt="수량 증가"
              >
            </button>
          </div>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });
  // 모든 상품이 체크됐는지 확인
  const isAllChecked =
    cartItems.length > 0 &&
    cartItems.every(function (item) {
      return item.checked === true;
    });

  // 전체가 체크됐으면 전체선택도 체크
  selectAllCheckbox.checked = isAllChecked;
}

renderCartItems();

//  [상품별 옵션 변경]
cartItemsContainer.addEventListener("click", function (event) {
  // 옵션변경 버튼 확인
  const optionButton = event.target.closest(".option-change");

  // 옵션 항목 확인
  const optionItem = event.target.closest(".option-list li");

  // ✅ 옵션변경 버튼을 클릭한 경우
  if (optionButton) {
    const cartItem = optionButton.closest(".cart-item");
    const optionList = cartItem.querySelector(".option-list");

    // 다른 상품의 옵션 목록 닫기
    document.querySelectorAll(".option-list").forEach(function (list) {
      if (list !== optionList) {
        list.classList.remove("open");
      }
    });

    optionList.classList.toggle("open");
    return;
  }

  // 옵션 하나를 선택한 경우
  if (optionItem) {
    const cartItem = optionItem.closest(".cart-item");
    const index = Number(cartItem.dataset.index);
    const cartItems = getCartItems();

    // 클릭한 옵션을 저장
    cartItems[index].option = optionItem.textContent.trim();

    saveCartItems(cartItems);
    renderCartItems();
  }
});








// // 옵션 드롭다운
// const optionChange = document.querySelector(".option-change");
// const optionList = document.querySelector(".option-list");

// optionChange.addEventListener("click", function(){
//     optionList.classList.toggle("open"); // toggle: open이 있으면 삭제하고 없으면 추가
// });

// const optionLi = document.querySelectorAll(".option-list li");
// const selectedOption = document.querySelector(".selected-option");

// optionLi.forEach(function(option){
//     option.addEventListener("click", function(){
//         selectedOption.textContent = option.textContent;
//         optionList.classList.remove("open");
//     })
// })

// // 옵션 수량 변경
// // 방법1) if문으로 -,+ 한번에 관리
// // const cartQuantity = document.querySelector(".cart-quantity");
// // const quantityValue = document.querySelector(".quantity-value");

// // let quantity = 1;

// // cartQuantity.addEventListener("click", function(event){

// //     const plusBtn = event.target.closest(".quantity-plus"); // 추가
// //     const minusBtn = event.target.closest(".quantity-minus"); // 추가

// //     if(plusBtn){ // 추가 : + 버튼을 클릭했다면
// //         quantity++;
// //         quantityValue.textContent = quantity;
// //     }
// //     else if(minusBtn && quantity > 1){ // 추가 : - 버튼이고 수량이 1보다 크다면
// //         quantity--;
// //         quantityValue.textContent = quantity;
// //     }

// // });

// // 방법2) 어떤 버튼을 클릭했는지 알아내는 기능이 아니므로 -,+ 각각 이벤트관리하는것이 좋음
// const quantityMinus = document.querySelector(".quantity-minus");
// const quantityPlus = document.querySelector(".quantity-plus");
// const quantityValue = document.querySelector(".quantity-value");

// let quantity = 1;

// quantityPlus.addEventListener("click", function(){
//     quantity++;
//     quantityValue.textContent = quantity;

// });

// quantityMinus.addEventListener("click", function(){
//     if(quantity > 1){
//     quantity--;
//     quantityValue.textContent = quantity;
//     }
// })


