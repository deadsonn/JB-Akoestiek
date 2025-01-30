document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header-container');

  // Fetch the header.html file
  fetch('header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.statusText}`);
      }
      return response.text();
    })
    .then(data => {
      // Inject the header content
      headerContainer.innerHTML = data;

      // Add event listeners for the hamburger menu
      const hamburgerMenu = document.getElementById('hamburgerMenu');
      const slidingMenu = document.getElementById('slidingMenu');
      hamburgerMenu.addEventListener('click', () => {
        slidingMenu.classList.toggle('active');
      });

      // Add event listeners for the new modal
      const authModal = document.getElementById('authModal');
      const signInButton = document.getElementById('signInButton');
      const signUpButton = document.getElementById('signUpButton');
      const logRegCircle = document.getElementById('logReg-circle');
      const container = document.getElementById('container');
      const signUpModalButton = document.getElementById('signUp');
      const signInModalButton = document.getElementById('signIn');

      // Open modal when signInButton or logRegCircle is clicked
      signInButton.addEventListener('click', () => {
        authModal.style.display = 'flex';
        container.classList.remove('right-panel-active');
      });

      signUpButton.addEventListener('click', () => {
        authModal.style.display = 'flex';
        container.classList.add('right-panel-active');
      });

      logRegCircle.addEventListener('click', () => {
        authModal.style.display = 'flex';
        container.classList.remove('right-panel-active');
      });

      // Switch between sign-in and sign-up forms
      signUpModalButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });

      signInModalButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });

      // Close modal when clicking outside the modal
      window.addEventListener('click', (e) => {
        if (e.target === authModal) {
          authModal.style.display = 'none';
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
});