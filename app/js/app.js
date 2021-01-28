// Округление цены
function priceCeil(price) {
  let newPrice = Math.ceil(price * 100) / 100;
  return String(newPrice).replace(".", ",");
}

// Модификатор картинок
function imageModifire(img) {
  const imageName = img.split(".").slice(0, -1).join(".");

  const imageType = img.slice(((img.lastIndexOf(".") - 1) >>> 0) + 2);

  const newImageName = imageName + "_220x220_1" + "." + imageType;

  return newImageName;
}

// Переключение стоимости товара
function changePrice() {
  const thisUnits = this.closest(".product").querySelectorAll(".unit--select");
  thisUnits.forEach((item) => item.classList.toggle("unit--active"));

  const prices = this.closest(".product").querySelectorAll(".price");

  prices.forEach((item) => item.classList.toggle("price--active"));
}

// Увеличить количество
function upCount() {
  let currCount = +this.closest(".stepper").querySelector(".product__count")
    .value;

  let newCount = currCount + 1;

  this.closest(".stepper").querySelector(".product__count").value = newCount;
}

// Уменьшить количество
function downCount() {
  let currCount = +this.closest(".stepper").querySelector(".product__count")
    .value;

  let newCount;

  if (currCount > 1) {
    newCount = currCount - 1;
  } else {
    newCount = 1;
  }

  this.closest(".stepper").querySelector(".product__count").value = newCount;
}

function createProduct(
  code,
  primaryImageUrl,
  title,
  assocProducts,
  priceGoldAlt,
  priceRetailAlt,
  priceGold,
  priceRetail,
  productId
) {
  // Форматирование и создание тегов
  const assocProductsFormat = assocProducts.split("\n");

  const newassocProductsFormat = assocProductsFormat.map((item) => {
    return item.slice(0, -1) + ",";
  });

  // Строка с тегами
  let productTagsList = ``;

  newassocProductsFormat.forEach((item, index) => {
    if (newassocProductsFormat.length - 1 == index) {
      item = item.replace(";", ".");
    }

    productTagsList += `<a href="#" class="url--link">${item}</a> `;
  });

  // Шаблон продукта
  const productTemplate = `
  <div class="product product_horizontal">
  <span class="product_code">Код: ${code}</span>
  <div class="product_status_tooltip_container">
      <span class="product_status">Наличие</span>
  </div>
  <div class="product_photo">
      <a href="#" class="url--link product__link">
          <img src="${imageModifire(primaryImageUrl)}">
      </a>
  </div>
  <div class="product_description">
      <a href="#" class="product__link">${title}</a>
  </div>
  <div class="product_tags hidden-sm">
      <p>Могут понадобиться:</p>
      ${productTagsList}
  </div>
  <div class="product_units">
      <div class="unit--wrapper">
          <div class="unit--select unit--active">
              <p class="ng-binding">За м. кв.</p>
          </div>
          <div class="unit--select">
              <p class="ng-binding">За упаковку</p>
          </div>
      </div>
  </div>
  <p class="product_price_club_card">
      <span class="product_price_club_card_text">По карте<br>клуба</span>
      <span class="goldPrice">
      <span class="price price--active">${priceCeil(priceGoldAlt)}</span>
      <span class="price">${priceCeil(priceGold)}</span>
      </span>
      <span class="rouble__i black__i">
          <svg version="1.0" id="rouble__b" xmlns="http://www.w3.org/2000/svg" x="0" y="0"
              width="30px" height="22px" viewBox="0 0 50 50"
              enable-background="new 0 0 50 50" xml:space="preserve">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_black">
              </use>
          </svg>
      </span>
  </p>
  <p class="product_price_default">
      <span class="retailPrice">
      <span class="price price--active">${priceCeil(priceRetailAlt)}</span>
      <span class="price">${priceCeil(priceRetail)}</span>
      </span>
      <span class="rouble__i black__i">
          <svg version="1.0" id="rouble__g" xmlns="http://www.w3.org/2000/svg" x="0" y="0"
              width="30px" height="22px" viewBox="0 0 50 50"
              enable-background="new 0 0 50 50" xml:space="preserve">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_gray">
              </use>
          </svg>
      </span>
  </p>
  <div class="product_price_points">
      <p class="ng-binding">Можно купить за 231,75 балла</p>
  </div>
  <div class="list--unit-padd"></div>
  <div class="list--unit-desc">
      <div class="unit--info">
          <div class="unit--desc-i"></div>
          <div class="unit--desc-t">
              <p>
                  <span class="ng-binding">Продается упаковками:</span>
                  <span class="unit--infoInn">1 упак. = 2.47 м. кв. </span>
              </p>
          </div>
      </div>
  </div>
  <div class="product__wrapper">
      <div class="product_count_wrapper">
          <div class="stepper">
              <input class="product__count stepper-input" type="text" value="1">
              <span class="stepper-arrow up"></span>
              <span class="stepper-arrow down"></span>
          </div>
      </div>
      <span class="btn btn_cart" data-url="/cart/"
          data-product-id="${productId}">
          <svg class="ic ic_cart">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart"></use>
          </svg>
          <span class="ng-binding">В корзину</span>
      </span>
  </div>
</div>
  `;

  const productList = document.querySelector(".products_page");
  productList.insertAdjacentHTML("beforeend", productTemplate);
}

// Получение данных и отрисовка шаблона
async function fetchProducts() {
  const response = await fetch("products.json");

  const products = await response.json(); // прочитать тело ответа как текст

  products.forEach(function (product) {
    createProduct(
      product.code,
      product.primaryImageUrl,
      product.title,
      product.assocProducts,
      product.priceGoldAlt,
      product.priceRetailAlt,
      product.priceGold,
      product.priceRetail,
      product.productId
    );
  });

  // Подлкючение обработчиков
  const stepperArrowUpList = document.querySelectorAll(".stepper-arrow.up");
  stepperArrowUpList.forEach((item) => {
    item.addEventListener("click", upCount);
  });

  const stepperArrowDownList = document.querySelectorAll(".stepper-arrow.down");
  stepperArrowDownList.forEach((item) => {
    item.addEventListener("click", downCount);
  });

  const units = document.querySelectorAll(".unit--select");
  units.forEach((item) => {
    item.addEventListener("click", changePrice);
  });
}
fetchProducts();
