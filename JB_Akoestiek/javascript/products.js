const products = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: 59.99 + i * 10,
  quantity: 2,
  image: "https://images.squarespace-cdn.com/content/v1/614a68d7da23344679d80759/1632593217235-LIVKP251VYPT3MYG4BAP/Broadband+Acoustic+Panels.png"
}));

// Function to render products
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById('products');
  productsGrid.innerHTML = productsToRender.map(product => `
      <div class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">€ ${product.price.toFixed(2)} <span class="quantity">${product.quantity} st.</span></p>
          <button type="button" class="button-primary">Add to Cart</button>
      </div>
  `).join('');
}

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
});

// Sort functionality
const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', (e) => {
  const sortedProducts = [...products];
  switch(e.target.value) {
      case 'price-asc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
      case 'price-desc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
      case 'newest':
          sortedProducts.sort((a, b) => b.id - a.id);
          break;
  }
  renderProducts(sortedProducts);
});

// Price range functionality
const priceRange = document.getElementById('priceRange');
priceRange.addEventListener('input', (e) => {
  const maxPrice = parseInt(e.target.value);
  const filteredProducts = products.filter(product => product.price <= maxPrice);
  renderProducts(filteredProducts);
});

// Initial render
renderProducts(products);