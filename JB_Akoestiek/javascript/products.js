const products = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: 59.99 + i * 10,
  quantity: 2,
  length: 120,
  width: 60 + i,
  height: 4 + i,
  image: "https://images.squarespace-cdn.com/content/v1/614a68d7da23344679d80759/1632593217235-LIVKP251VYPT3MYG4BAP/Broadband+Acoustic+Panels.png"
}));

// Function to render products
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById('products');
  productsGrid.innerHTML = productsToRender.map(product => `
      <div class="product-card"
           data-id="${product.id}"
           data-name="${product.name}"
           data-price="${product.price.toFixed(2)}"
           data-quantity="${product.quantity}"
           data-length="${product.length}"
           data-width="${product.width}"
           data-height="${product.height}"
           data-image="${product.image}">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <span class="size">${product.length}x${product.width}x${product.height}<span class="size-unit">cm</span></span> 
          <p class="price">€ ${product.price.toFixed(2)} <span class="quantity">${product.quantity} st.</span></p>
          <button type="button" class="button-primary">In winkelmand</button>
      </div>
  `).join('');

  // Attach click listener for each product-card (except when clicking the button)
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (event) => {
      // Do nothing if the "in winkelmand" button was clicked.
      if (event.target.closest('.button-primary')) return;
      
      const dataset = card.dataset;
      const productData = {
        id: dataset.id,
        name: dataset.name,
        price: dataset.price,
        quantity: dataset.quantity,
        length: dataset.length,
        width: dataset.width,
        height: dataset.height,
        image: dataset.image
      };
      showProductModal(productData);
    });
  });
}

// Function to show the product modal with the clicked product’s data
function showProductModal(product) {
  const modal = document.querySelector('.product');
  if (!modal) return;

  // Update title with product name and id
  modal.querySelector('.title h1').textContent = product.name;
  modal.querySelector('.title span').textContent = `COD: ${product.id}`;
  
  // Update price area
  modal.querySelector('.price2 span').textContent = product.price;
  
  // Compute size string and replace the benefits section with "DETAILS"
  const computedSize = `${product.length}x${product.width}x${product.height}cm`;
  const detailsHTML = `
    <h3>DETAILS</h3>
    <ul>
      <li>Name: ${product.name}</li>
      <li>Quantity: ${product.quantity}</li>
      <li>Size: ${computedSize}</li>
    </ul>
  `;
  const descriptionDiv = modal.querySelector('.description');
  descriptionDiv.innerHTML = detailsHTML;
  
  // Update main photo
  const mainImg = modal.querySelector('.photo-main img');
  mainImg.src = product.image;
  mainImg.alt = product.name;
  
  // Add close icon in top-right corner if not already present
  let closeIcon = modal.querySelector('.closeProductModalButton');
  if (!closeIcon) {
    closeIcon = document.createElement('span');
    closeIcon.className = "material-symbols-outlined closeProductModalButton";
    closeIcon.textContent = "delete";
    // Append close icon to the product info container
    modal.querySelector('.product__info').appendChild(closeIcon);
    closeIcon.addEventListener('click', hideProductModal);
  }
  
  // Show the modal (by adding an "active" class)
  modal.classList.add('active');
  
  // Add a one-time listener to close the modal if clicking outside it
  setTimeout(() => {
    document.addEventListener('click', outsideClickListener);
  }, 0);
  
  function outsideClickListener(e) {
    if (!modal.contains(e.target)) {
      hideProductModal();
      document.removeEventListener('click', outsideClickListener);
    }
  }
}

// Function to hide the product modal
function hideProductModal() {
  const modal = document.querySelector('.product');
  if (modal) {
    modal.classList.remove('active');
  }
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
