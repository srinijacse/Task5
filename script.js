let products = [];
let cart = [];

let visibleCount = 0;
const BATCH_SIZE = 12;

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    products = data.products;
    visibleCount = 0;
    renderProducts(true);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // ✅ Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showCart() {
  const cartList = document.getElementById("cartList");
  const totalBox = document.getElementById("cartTotal");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <img src="${item.thumbnail}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #ccc;" />
        <div>
          <div style="font-weight: bold;">${item.title}</div>
          <div>Qty: ${item.quantity}</div>
          <div>₹${(item.price * 80 * item.quantity).toFixed(0)}</div>
        </div>
      </div>
    `;
    cartList.appendChild(li);

    total += item.price * item.quantity * 80;
  });

  totalBox.textContent = `Total: ₹${total.toFixed(0)}`;
}


function setupCartEvents() {
  const cartIcon = document.getElementById("cartIcon");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartBtn = document.getElementById("closeCart");

  cartIcon.addEventListener("click", () => {
    cartPanel.classList.add("open");
  });

  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });
}

function renderProducts(reset = false) {
  const list = document.getElementById("productList");
  if (reset) {
    list.innerHTML = "";
    visibleCount = 0;
  }

  const category = document.getElementById("categoryFilter").value;
  let filtered = [...products];
  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  const sort = document.getElementById("sort").value;
  if (sort === "priceLow") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "priceHigh") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const batch = filtered.slice(visibleCount, visibleCount + BATCH_SIZE);
  batch.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" loading="lazy"/>
      <h3>${product.title}</h3>
      <p>₹${(product.price * 80).toFixed(0)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    list.appendChild(li);
  });

  visibleCount += BATCH_SIZE;

  const loadMoreBtn = document.getElementById("loadMore");
  loadMoreBtn.style.display = visibleCount < filtered.length ? "block" : "none";
}

document.getElementById("categoryFilter").addEventListener("change", () => renderProducts(true));
document.getElementById("sort").addEventListener("change", () => renderProducts(true));
document.getElementById("loadMore").addEventListener("click", () => renderProducts(false));

// ✅ Only call this after DOM is ready
window.onload = () => {
  fetchProducts();
  setupCartEvents();
};
