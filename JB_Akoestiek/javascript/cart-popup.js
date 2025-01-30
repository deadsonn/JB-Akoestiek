//JavaScript for cart toggle 
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.getElementById('cartButton');
  const cartPopup = document.getElementById('cartPopup');
  const closeCart = document.getElementById('closeCart');

  cartButton.addEventListener('click', () => {
    cartPopup.classList.toggle('open');
    cartPopup.classList.remove('open');
  });

  closeCart.addEventListener('click', () => {
    cartPopup.classList.remove('open');
  });
});
