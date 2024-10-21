document.addEventListener('DOMContentLoaded', function (){
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${day}-${month}-${year}`;
  }
  
  const today = new Date();
  const sevenDaysLater = new Date();
  
  const todayDate = document.getElementById("today-date");
  let formatTodayDate = formatDate(today);
  todayDate.innerText = formatTodayDate;
  
  
  const expDate = document.getElementById("exp-date");
  sevenDaysLater.setDate(today.getDate() + 7);
  let formatExpDate = formatDate(sevenDaysLater);
  expDate.innerText = formatExpDate;

});


const productCount = document.getElementById("product-count");
function productIncrease(itemID, itemPrice){
  const countElement = document.getElementById(`product-count-${itemID}`);
  let count = parseInt(countElement.innerText);
  count += 1;
  countElement.innerText = count;

  totalPrice += itemPrice;
  updateCartPrice();
};

function productDecrease(itemID, itemPrice){
  const countElement = document.getElementById(`product-count-${itemID}`);
  let count = parseInt(countElement.innerText);
  if (count > 1) {
    count -= 1;
    countElement.innerText = count;
    totalPrice -= itemPrice;
    updateCartPrice();
  };
};

const shoppingCart = document.querySelector('.fa-shopping-cart');
const cartPage = document.querySelector('.cart-page');
const closeCart = document.querySelector('.close-cart');

shoppingCart.addEventListener('click', (e)=>{
  const cartPageDisplay = window.getComputedStyle(cartPage).display;
  e.stopPropagation();

  if (cartPageDisplay === 'none'){
    cartPage.style.display = 'flex';
    cartPage.style.animation = 'fromLeft 1s forwards'
  } else {
    cartPage.style.animation = 'fromRight 1s forwards';
    setTimeout(()=>{
      cartPage.style.display = 'none';
    }, 1000)
  }
});
document.addEventListener('click', (e)=>{
  cartPageDisplay = window.getComputedStyle(cartPage).display;
  if (cartPageDisplay === 'flex' && !cartPage.contains(e.target)){
    // Ensure the click wasn't on the remove button
    const isRemoveButton = e.target.closest('.trash-cartp') !== null;
    if (!isRemoveButton){
      cartPage.style.animation = 'fromRight 1s forwards';
      setTimeout(()=>{
        cartPage.style.display = 'none';
      }, 1000)
    }
  }
});
closeCart.addEventListener('click', (e)=>{
  cartPageDisplay = window.getComputedStyle(cartPage).display;
  if (cartPageDisplay === 'flex'){
    cartPage.style.animation = 'fromRight 1s forwards';
    setTimeout(()=>{
      cartPage.style.display = 'none';
    }, 1000)
  }
});

// empty cart

const cartItems = document.querySelector('.cart-product-list');
const cartFooter = document.querySelector('.cart-footer');
if (cartItems.children.length === 0){
  cartFooter.style.display = 'none';
  const emptyCart = document.createElement('div');
  emptyCart.innerHTML = `<img src="emptycart.png" alt='empty cart'><h4>NO ITEM IN THE CART</h4>`;
  emptyCart.classList.add('empty-cart');
  cartItems.appendChild(emptyCart);

}


// Add-To-Cart
let totalPrice = 0;
function addToCart(button){
  let item = button.closest('.category-product'); // For products with a link title
  if (!item) {
    item = button.closest('.top-pick-product'); // For products with an h4 title (use the correct class here)
  }
  const selectedSize = item.querySelector('#select-size').value;
  if (selectedSize === 'select') {
    alert('Please select a size before adding to cart.');
    return;
  }

  const cartItemID = `cart-item-${Date.now()}`;
  
  const cartProduct = document.createElement('div');
  cartProduct.classList.add('cart-product');
  cartProduct.setAttribute('id', cartItemID);
  // product-image
  const imgSrc = item.querySelector('img').getAttribute('src');
  const img = document.createElement('img');
  img.classList.add('cart-product-img');
  img.setAttribute('src', imgSrc);
  // product-discription
  // const title = item.querySelector('.c-p-caption a').innerText;
  let title = '';
  
  // Check if there is a title in .c-p-caption a
  const anchorTitle = item.querySelector('.c-p-caption a');
  if (anchorTitle) {
    title = anchorTitle.innerText; // If title is found in <a>, use it
  } else {
    // Otherwise, check for title in <h4> tag
    const h4Title = item.querySelector('h4');
    if (h4Title) {
      title = h4Title.innerText;
    }
  }
  let price = '';
  
  // Check if there is a title in .c-p-caption a
  const pPrice = item.querySelector('.price-cart p');
  if (pPrice) {
    price = pPrice.innerText; // If title is found in <a>, use it
  } else {
    // Otherwise, check for title in <h4> tag
    const h5Price = item.querySelector('h5');
    if (h5Price) {
      price = h5Price.innerText;
    }
  }
  // const price = item.querySelector('.price-cart p').innerText;
  const productPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
  
  const cartProductDiscription = document.createElement('div');
  cartProductDiscription.classList.add('cart-product-discription');
  cartProductDiscription.innerHTML = `
  <h3>${title}</h3>
  <p>Price: ${price}</p>
  <p>Size: ${selectedSize}</p>
  `;
  
  // product-count
  const productCountBox = document.createElement('div');
  productCountBox.classList.add('product-count-box');
  productCountBox.innerHTML = `<span><button onclick="productDecrease('${cartItemID}', ${productPrice})"><i class="fa fa-minus"></i></button></span>
  <span id="product-count-${cartItemID}">1</span>
  <span><button onclick="productIncrease('${cartItemID}', ${productPrice})"><i class="fa fa-plus"></i></button></span>`;
  // trash-product
  const trashBtn = document.createElement('button');
  trashBtn.classList.add('trash-cartp');
  trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
  trashBtn.onclick = () => removeCartItem(cartItemID, productPrice);

  
  cartProduct.appendChild(img);
  cartProduct.appendChild(cartProductDiscription);
  cartProductDiscription.appendChild(productCountBox);
  cartProduct.appendChild(trashBtn);
  
  const cartItems = document.querySelector('.cart-product-list');
  cartItems.appendChild(cartProduct);
  
  const emptyCart = document.querySelector('.empty-cart');
  const cartFooter = document.querySelector('.cart-footer');
  if (emptyCart){
    emptyCart.style.display = 'none';
    cartFooter.style.display = 'flex';
  }
  
  // price calculation
  const countElement = document.getElementById(`product-count-${cartItemID}`);
  const currentCount = parseInt(countElement.innerText);
  totalPrice +=productPrice * currentCount;
  updateCartPrice();

  addToCartMessage(title);
};

function addToCartMessage(productName) {
  const notification = document.createElement('div');
  notification.classList.add('add-to-cart-notification');
  notification.innerText = `${productName} added to your cart!`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
  }, 100); // Small delay for smoother appearance

  // Remove the notification after 3 seconds
  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
          notification.remove();
      }, 500); // Wait for the fade-out transition to complete before removing
  }, 3000);
};

function removeCartItem(cartItemID, itemPrice) {
  const countElement = document.getElementById(`product-count-${cartItemID}`);
  const currentCount = parseInt(countElement.innerText);
  totalPrice -= itemPrice * currentCount;
  updateCartPrice();  

  const cartItems = document.querySelectorAll(`[id="${cartItemID}"]`);
  cartItems.forEach((item) => item.remove());

  
  const cartProductList = document.querySelector('.cart-product-list');
  const cartFooter = document.querySelector('.cart-footer');
  const emptyCart = document.querySelector('.empty-cart');
  
  if (emptyCart) {
    emptyCart.remove();
  }
  if (cartProductList.children.length === 0){
    cartFooter.style.display = 'none';
    const emptyCart = document.createElement('div');
    emptyCart.innerHTML = `<img src="emptycart.png" alt='empty cart'><h4>NO ITEM IN THE CART</h4>`;
    emptyCart.classList.add('empty-cart');
    cartProductList.appendChild(emptyCart);
  }
};

function updateCartPrice(){
  const totalCartPrice = document.getElementById('totalPrice');
  totalCartPrice.innerText = `£${totalPrice}`;
};

const hamburger = document.querySelector('.hamburger-menu');
const dropdown = document.querySelector('.hamburger-dropdown');

hamburger.addEventListener('click', (e) => {
  // Check the computed style of the dropdown (to get its actual display value)
  const dropdownDisplay = window.getComputedStyle(dropdown).display;
  e.stopPropagation();

  if (dropdownDisplay === 'none'){
    dropdown.style.display = 'block';
    dropdown.style.animation = 'slideRight 1s forwards';
  } else {
    dropdown.style.animation = 'slideLeft 1s forwards';
    setTimeout(()=>{
      dropdown.style.display = 'none';
    }, 1000);
  }
});

document.addEventListener('click', (e)=>{
  const dropdownDisplay = window.getComputedStyle(dropdown).display;
  if (dropdownDisplay === 'block' && !dropdown.contains(e.target)) {
    dropdown.style.animation = 'slideLeft 1s forwards';
    setTimeout(()=>{
      dropdown.style.display = 'none';
    }, 1000);
  }
})

let slideIndex = 0;
let autoSlideInterval;
showSlides(slideIndex);

function plusSlides(n) {
  clearInterval(autoSlideInterval)
  showSlides(slideIndex +=n);
  startAutoSlide()
}
function currentSlide(n) {
  clearInterval(autoSlideInterval)
  slideIndex = n -1;
  showSlides(slideIndex);
  startAutoSlide()
}

function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n<0) {
    slideIndex = slides.length - 1;
  }
  for (i=0; i<slides.length; i++){
    slides[i].style.display = 'none';
  }
  slides[slideIndex].style.display = 'block';
}

function startAutoSlide(){
  autoSlideInterval = setInterval(()=>{
    slideIndex++;
    showSlides(slideIndex);
  }, 3000);
}
startAutoSlide();

const sizeButtons = document.querySelectorAll(".size-btn");
sizeButtons.forEach(btn =>{
  btn.addEventListener("click", function() {
    sizeButtons.forEach(button => button.classList.remove('selected'))
    this.classList.add('selected');
  });
});

function updatePriceValue () {
  const price = document.getElementById("price-slider").value;
  document.getElementById("price-value").textContent = price;  
}

function applyFilters () {
  const selectedPrice = document.getElementById("price-slider").value;
  const categories = document.querySelectorAll('input[name="category"]:checked');
  const brands = document.querySelectorAll('input[name="brand"]:checked');

  let selectedCategories = []
  let selectedBrands = []

  categories.forEach(category => selectedCategories.push(category.value));
  brands.forEach(brand => selectedBrands.push(brand.value));
  console.log("Selected Price:", selectedPrice);
  console.log("Categories:", selectedCategories);
  console.log("Brands:", selectedBrands);
}

function toggleBrandDropdown() {
  const brandDropdown = document.getElementById("brand-dropdown");
  brandDropdown.style.display = brandDropdown.style.display === 'block' ? 'none' : 'block';
}

function toggleCategoryDropdown() {
  const categoryDropdown = document.getElementById("category-dropdown");
  categoryDropdown.style.display = categoryDropdown.style.display === 'block' ? 'none' : 'block';
}

// Not Working Properly

document.addEventListener('click', (e) => {
  const brandDropdown = document.getElementById("brand-dropdown");
  const brandDropdownBtn = document.getElementById("brand-dropdown-btn");
  const categoryDropdown = document.getElementById("category-dropdown");
  const categoryDropdownBtn = document.getElementById("category-dropdown-btn");

  if (!brandDropdown.contains(e.target) && !brandDropdownBtn.contains(e.target)) {
      brandDropdown.style.display = 'none';
  }

  if (!categoryDropdown.contains(e.target) && !categoryDropdownBtn.contains(e.target)) {
      categoryDropdown.style.display = 'none';
  }
});

// Ensure the dropdown button click doesn't propagate to document listener
document.getElementById("brand-dropdown-btn").addEventListener('click', (e) => {
  e.stopPropagation();
  toggleBrandDropdown();
});

document.getElementById("category-dropdown-btn").addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCategoryDropdown();
});

// Products Sorting
function sortProducts() {
  const sortValue = document.getElementById("sort-options").value;
  const productList = document.querySelector(".product-list");
  const products = Array.from(productList.getElementsByClassName("category-product"));

  products.sort(function(a,b){
    const priceA = parseFloat(a.getAttribute("data-price"));
    const priceB = parseFloat(b.getAttribute("data-price"));
    const nameA = a.getAttribute("data-name").toLowerCase();
    const nameB = b.getAttribute("data-name").toLowerCase();

    switch (sortValue) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      default:
        return 0;
    }
  });

  productList.innerHTML = '';
  products.forEach(function(product) {
    productList.appendChild(product);
  });

}

