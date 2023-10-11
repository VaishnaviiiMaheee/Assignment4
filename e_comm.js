

function renderProducts(products) {
  const productsHTML = products.map((product) => {
    return `
    <div class="product_card">
      <img src="${product.image}" alt="${product.title}">
      <h1>${product.title}</h1>
      <p>${product.category}</p>
      <h3>$${product.price}</h3>
      <button onclick="addToCart('${product.id}', '${product.title}', '${product.price}', '${product.image}')">Add to Cart</button>
      <a href="product_details.html?id=${product.id}&title=${encodeURIComponent(product.title)}&category=${encodeURIComponent(product.category)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}" class="view_details_btn">View Details</a>
</div>
    `;
  }).join('');
  const productContainer = document.querySelector('.product_container');
  productContainer.innerHTML = productsHTML;
}

function fetchAndRenderProducts() {
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(error => console.log(error));
}

function showProductsByCategory() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const category = decodeURIComponent(urlSearchParams.get('category'));
  const categoryName = document.querySelector('#category_name');
  categoryName.innerHTML = category;
  const productsEndpoint = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
  fetch(productsEndpoint)
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(error => console.log(error));
}
function showCategories(){
  fetch('https://fakestoreapi.com/products/categories').then(response=>response.json())
  .then(categories=>{
    const categoriesDropdown=document.getElementById('categoriesDropdown');
    const categoriesHTML=categories.map((category)=>{
      return `
      <a href="category.html?category=${encodeURIComponent(category)}">${category}</a>`;
    }).join(' ');
    categoriesDropdown.innerHTML=categoriesHTML;
  })
  .catch(error=>console.log(error));
}

document.addEventListener("DOMContentLoaded",function(){
  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get("id");
  const title = decodeURIComponent(urlSearchParams.get("title"));
  const category = decodeURIComponent(urlSearchParams.get("category"));
  const price = urlSearchParams.get("price");
  const image = decodeURIComponent(urlSearchParams.get("image"));
  const description = decodeURIComponent(urlSearchParams.get("description"));

  if (id) {  
    const section = document.querySelector(".product_details");

    const h1 = document.createElement("h1");
    h1.innerHTML = title;
    section.appendChild(h1);

    const img = document.createElement("img");
    img.src = image;
    section.appendChild(img);

    const p1 = document.createElement("p");
    p1.innerHTML = `Category: ${category}`;
    section.appendChild(p1);

    const p2 = document.createElement("p");
    p2.innerHTML = `Price: $${price}`;
    section.appendChild(p2);

    const p3 = document.createElement("p");
    p3.innerHTML = description;
    section.appendChild(p3);
  }

  fetchAndRenderProducts();
});

function addToCart(id, title, price, image, quantity = 1) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let itemExists = false;
  cartItems.forEach(item => {
    if (item.id === id) {
      item.quantity += quantity;
      item.total = item.quantity * item.price;
      itemExists = true;
      return;
    }
  });
  if (!itemExists) {
    const newItem = {id, title, price, quantity, total: price * quantity, inStock:quantity, image};
    cartItems.push(newItem);
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartCount();
}

function updateCartCount() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartCount = document.getElementById('cart-count');
  cartCount.innerHTML = cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

function showCart() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartTableBody = document.getElementById('cart-table-body');
  cartTableBody.innerHTML = '';
  const cartTotal = document.getElementById('cart-total');
  let total = 0;
  cartItems.forEach(item => {
    const row = document.createElement('tr');
    const title = document.createElement('td');
    title.innerHTML = item.title;
    const price = document.createElement('td');
    price.innerHTML = `$${item.price}`;
    const quantity = document.createElement('td');
    const plusBtn = document.createElement('button');
    plusBtn.innerHTML = '+';
    const minusBtn = document.createElement('button');
    minusBtn.innerHTML = '-';
    // minusBtn.disabled = (item.quantity < 1);
    // plusBtn.disabled = (item.quantity === item.inStock);
    plusBtn.onclick = function() {
      item.quantity++;
      item.inStock--;
      item.total = item.quantity * item.price;
      quantity.innerHTML = item.quantity;
      // minusBtn.disabled = (item.quantity < 1);
      // plusBtn.disabled = (item.inStock === 0);
      total = cartItems.reduce((acc, item) => acc + item.total, 0);
      cartTotal.innerHTML = `$${total}`;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    };
    minusBtn.onclick = function() {
      item.quantity--;
      item.inStock++;
      if (item.quantity < 1) {
        cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        row.remove();
      } else {
        item.total = item.quantity * item.price;
        quantity.innerHTML = item.quantity;
        // minusBtn.disabled = (item.quantity <1);
        // plusBtn.disabled = (item.inStock === 0);
      }
      total = cartItems.reduce((acc, item) => acc + item.total, 0);
      cartTotal.innerHTML = `$${total}`;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    };
  
document.querySelectorAll('button').forEach(btn => { btn.style.display = 'inline-block'; });
    quantity.appendChild(plusBtn);
    quantity.appendChild(document.createTextNode(item.quantity));
    quantity.appendChild(minusBtn);
    const itemTotal = document.createElement('td');
    itemTotal.innerHTML = `$${item.total}`;
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = 'Remove';
    removeBtn.onclick = function() {
      cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      row.remove();
      total = cartItems.reduce((acc, item) => acc + item.total, 0);
      cartTotal.innerHTML = `$${total}`;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    };
    const action = document.createElement('td');
    action.appendChild(removeBtn);
    row.appendChild(title);
    row.appendChild(price);
    row.appendChild(quantity);
    row.appendChild(itemTotal);
    row.appendChild(action);
    cartTableBody.appendChild(row);
    total = cartItems.reduce((acc, item) => acc + item.total, 0);
    cartTotal.innerHTML = `$${total}`;
  });
  const cartModal = document.getElementById('cartModal');
  const modalClose = document.getElementsByClassName('close')[0];
  cartModal.style.display = "block";
}

function checkout() {
  localStorage.removeItem('cartItems');
  const cartCount = document.getElementById('cart-count');
  cartCount.innerHTML = 0;
  const cartModal = document.getElementById('cartModal');
  cartModal.style.display = "none";
  alert('Payment successful!');
}

document.getElementById('cart-tab').addEventListener('click', function() {
  showCart();
});
