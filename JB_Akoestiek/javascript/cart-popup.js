//JavaScript for cart toggle 
const cartButton = document.getElementById('cartButton');
const cartPopup = document.getElementById('cartPopup');
const closeCart = document.getElementById('closeCart');

cartButton.addEventListener('click', () => {
  cartPopup.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
  cartPopup.classList.remove('open');
});
