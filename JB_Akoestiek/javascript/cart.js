// cart.js

const cart = {
  items: [],
  addItem(product) {
    // Create a unique key from name, size, color and fabric.
    const key = product.name + '|' + product.size + '|' + product.color + '|' + product.fabric;
    let existingItem = this.items.find(item => item.key === key);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      product.key = key;
      this.items.push(product);
    }
  },
  removeOneItem(key) {
    const index = this.items.findIndex(item => item.key === key);
    if (index !== -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--;
      } else {
        this.items.splice(index, 1);
      }
    }
  },
  addOneItem(key) {
    const existingItem = this.items.find(item => item.key === key);
    if (existingItem) {
      existingItem.quantity++;
    }
  },
  deleteItem(key) {
    const index = this.items.findIndex(item => item.key === key);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  },
  getSubtotal() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
};

function calculateTotals() {
  const subtotal = cart.getSubtotal();
  const shipping = 12.55;
  const tax = (subtotal + shipping) * 0.21;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// Global variable to track current cart popup view: "cart", "checkout", or "payment"
let currentCartView = "cart";

// RENDER FUNCTIONS

function renderCartView() {
  currentCartView = "cart";
  const cartPopup = document.getElementById('cartPopup');
  cartPopup.innerHTML = `
    <span class="material-symbols-outlined" id="closeCart">close</span>
    <h2>Winkelwagen</h2>
    <div class="cart-content">
      <div class="product-summary-container"></div>
      <div class="order-summary">
        <p></p>
        <p>Subtotaal: €0,00</p>
        <p>Verzendkosten: €0,00</p>
        <p>BTW: €0,00</p>
        <p><strong>Totaalprijs: €0,00</strong></p>
      </div>
    </div>
    <button class="cashregister-button">Verzendgegevens</button>
  `;
  // Attach event listeners
  document.getElementById('closeCart').addEventListener('click', () => {
    cartPopup.classList.remove('open');
  });
  document.querySelector('.cashregister-button').addEventListener('click', () => {
    renderCheckoutView();
  });
  // Update product summary and totals
  updateCartUI();
}

function renderCheckoutView() {
  currentCartView = "Checkout";
  const cartPopup = document.getElementById('cartPopup');
  cartPopup.innerHTML = `
    <span class="material-symbols-outlined" id="pageBackCart">arrow_back</span>
    <h2>Checkout</h2>
    <div class="checkout-form-container">
      <form id="checkoutForm">
        <input type="text" name="firstName" placeholder="Voornaam" required>
        <input type="text" name="lastName" placeholder="Achternaam" required>
        <input type="text" name="street" placeholder="Straatnaam" required>
        <input type="text" name="zip" placeholder="Postcode" required>
        <input type="text" name="city" placeholder="Stad" required>
        <input type="text" name="country" placeholder="Land" required>
        <input type="email" name="email" placeholder="E-mailadres" required>
        <button type="submit" class="cashregister-button" id="betalingButton" disabled>Betaling</button>
      </form>
    </div>
  `;
  // Back button goes to cart view
  document.getElementById('pageBackCart').addEventListener('click', () => {
    renderCartView();
  });
  const checkoutForm = document.getElementById('checkoutForm');
  const betalingButton = document.getElementById('betalingButton');
  
  // Enable the Betaling button when the form is valid
  checkoutForm.addEventListener('input', () => {
    if (checkoutForm.checkValidity()) {
      betalingButton.disabled = false;
    } else {
      betalingButton.disabled = true;
    }
  });
  
  // On form submit, prevent default and show payment view
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    renderPaymentView();
  });
}

function renderPaymentView() {
  currentCartView = "payment";
  const cartPopup = document.getElementById('cartPopup');
  cartPopup.innerHTML = `
    <span class="material-symbols-outlined" id="pageBackCart">arrow_back</span>
    <h2>Betaling</h2>
    <div class="payment-container">
    <h4>Samenvatting</h4>
        <div class="final-summary-container">
          Bestelling
          Verzendgegevens
        </div>


      <h4>Betaalmethode</h4>
      <ul>
        <li><button>iDeal</button></li>
        <li><button>Visa / Mastercard</button></li>
        <li><button>PayPal</button></li>
      </ul>
    </div>
  `;
  // In payment view the back button goes to the checkout view
  document.getElementById('pageBackCart').addEventListener('click', () => {
    renderCheckoutView();
  });
}

// UPDATE THE CART VIEW (only if current view is "cart")
function updateProductSummary() {
  const summaryContainer = document.querySelector('.product-summary-container');
  if (!summaryContainer) return;
  summaryContainer.innerHTML = '';

  if (cart.items.length === 0) {
    summaryContainer.textContent = 'Uw winkelwagen is leeg';
    return;
  }

  cart.items.forEach(item => {
    const productSummary = document.createElement('div');
    productSummary.classList.add('product-summary');
    productSummary.innerHTML = `
      <div class="prodsum-prodname">${item.name}</div>
      <div class="product-info-grid">
        <div class="prodsum-prodquantity"><p>${item.quantity}.st</p></div>
        <div class="prodsum-size"><p>${item.size}</p></div>
        <div class="prodsum-color"><p>${item.color}</p></div>
        <div class="prodsum-fabric"><p>${item.fabric}</p></div>
      </div>
      <div class="product-summary-buttons">
        <span class="material-symbols-outlined removeOneButton" data-key="${item.key}">remove</span>
        <span class="material-symbols-outlined deleteProductButton" data-key="${item.key}">delete</span>
        <span class="material-symbols-outlined addOneButton" data-key="${item.key}">add</span>
      </div>
    `;
    summaryContainer.appendChild(productSummary);
  });

  // Attach event listeners for each button in the generated summaries.
  document.querySelectorAll('.removeOneButton').forEach(btn => {
    btn.addEventListener('click', event => {
      const key = event.target.getAttribute('data-key');
      cart.removeOneItem(key);
      updateCartUI();
    });
  });
  document.querySelectorAll('.addOneButton').forEach(btn => {
    btn.addEventListener('click', event => {
      const key = event.target.getAttribute('data-key');
      cart.addOneItem(key);
      updateCartUI();
    });
  });
  document.querySelectorAll('.deleteProductButton').forEach(btn => {
    btn.addEventListener('click', event => {
      const key = event.target.getAttribute('data-key');
      cart.deleteItem(key);
      updateCartUI();
    });
  });
}

function updateCartUI() {
  // Only update the cart view if we are in the "cart" page.
  if (currentCartView !== "cart") return;
  const totals = calculateTotals();
  const orderSummary = document.querySelector('.cart-popup .order-summary');
  if (orderSummary) {
    const summaryParagraphs = orderSummary.querySelectorAll('p');
    summaryParagraphs[1].textContent = `Subtotaal: €${totals.subtotal.toFixed(2)}`;
    summaryParagraphs[2].textContent = `Verzendkosten: €${totals.shipping.toFixed(2)}`;
    summaryParagraphs[3].textContent = `BTW: €${totals.tax.toFixed(2)}`;
    const totalEl = orderSummary.querySelector('p strong');
    if (totalEl) {
      totalEl.textContent = `Totaalprijs: €${totals.total.toFixed(2)}`;
    }
  }
  updateProductSummary();
}

// EVENT LISTENER FOR ADD TO CART BUTTON (remains unchanged)
document.querySelectorAll('.button-primary').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent.trim();
    let priceText = productCard.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('€', '').replace(',', '.').trim());
    const sizeText = productCard.querySelector('.size').textContent.trim();
    const color = productCard.getAttribute('data-color') || 'Blauw';
    const fabric = productCard.getAttribute('data-fabric') || 'Katoen';

    const product = {
      name: productName,
      price: price,
      size: sizeText,
      color: color,
      fabric: fabric,
      quantity: 1
    };

    cart.addItem(product);
    // If we are in the cart view, update its content
    if (currentCartView === "cart") {
      updateCartUI();
    }
    openCartPopup();
  });
});

// CART POPUP OPEN/CLOSE FUNCTIONS
function openCartPopup() {
  const cartPopup = document.getElementById('cartPopup');
  // If no view is set, render the default cart view.
  if (!currentCartView || currentCartView === "cart") {
    renderCartView();
  }
  if (!cartPopup.classList.contains('open')) {
    cartPopup.classList.add('open');
  }
}

function closeCartPopup() {
  const cartPopup = document.getElementById('cartPopup');
  cartPopup.classList.remove('open');
}




// (Optional) If needed, you can update the closeCart listener in header.js or here.
