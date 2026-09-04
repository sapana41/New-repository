let allProducts = [], filtered = [], currentPage = 1;
const perPage = 24;

const IMG = {
  Shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400"
  ],
  Watch: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    "https://images.unsplash.com/photo-1524805444973-bf35b5d0a8d4?w=400"
  ],
  Bag: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"
  ],
  Jeans: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"],
  Shirt: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"],
  "T-Shirt": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"]
};

function getImg(p) {
  let arr = IMG[p.category] || IMG['Shoes'];
  return arr[p.id % arr.length];
}

async function loadProducts(q = "") {
  const res = await fetch(q ? `/api/products?search=${q}` : '/api/products');
  allProducts = await res.json();
  filtered = allProducts;
  currentPage = 1;
  render();
}

function render() {
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);
  document.getElementById('product-count').innerText = `${filtered.length} Products`;
  document.getElementById('products').innerHTML = pageItems.map(p => `
    <div class="card">
      <img src="${getImg(p)}" onclick="location.href='product.html?id=${p.id}'" />
      <div class="cat">${p.category}</div>
      <h3>${p.name}</h3>
      <p><b>Rs. ${p.price}</b></p>
      <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`).join('');
  
  let totalPages = Math.ceil(filtered.length / perPage);
  let h = '';
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 20) h += `<button onclick="goPage(${i})" class="${i==currentPage?'active':''}">${i}</button>`;
  }
  document.getElementById('pagination').innerHTML = h;
}

function goPage(p) { currentPage = p; render(); window.scrollTo(0,0); }
function searchProducts() { loadProducts(document.getElementById('searchInput').value); }
function filterByCategory() { 
  const c = document.getElementById('categoryFilter').value; 
  filtered = c ? allProducts.filter(p => p.category == c) : allProducts; 
  currentPage = 1; 
  render(); 
}
function addToCart(id) { 
  let cart = JSON.parse(localStorage.getItem('cart') || '[]'); 
  cart.push(id); 
  localStorage.setItem('cart', JSON.stringify(cart)); 
  document.getElementById('cart-count').innerText = cart.length; 
  alert('Added!'); 
}
async function viewCart() {
  const ids = JSON.parse(localStorage.getItem('cart') || '[]');
  const all = await (await fetch('/api/products')).json();
  let t = 0, h = '';
  ids.forEach(id => { const p = all.find(x => x.id == id); if (p) { t += p.price; h += `<p>${p.name} - Rs.${p.price}</p>`; }});
  document.getElementById('cart-items').innerHTML = h || 'Empty';
  document.getElementById('cart-total').innerText = 'Total: Rs. ' + t;
  document.getElementById('cart-modal').style.display = 'block';
}
function closeCart() { document.getElementById('cart-modal').style.display = 'none'; }
async function placeOrder() { alert('Order Placed!'); localStorage.removeItem('cart'); closeCart(); location.reload(); }

loadProducts();