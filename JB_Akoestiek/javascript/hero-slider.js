//JavaScript voor slider 
 
const slides = document.querySelectorAll(".hero-slide");
let currentSlide = 0;

// Initialiseer posities van de slides
function updateSlides() {
  slides.forEach((slide, index) => {
    // Elke slide krijgt een verticale offset van (index - currentSlide) * 100%
    slide.style.transform = `translateY(${(index - currentSlide) * 100}%)`;
  });
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0; // Ga terug naar de eerste slide
  }
  updateSlides();
}

// Startpositie bij laden
updateSlides();

// Verschuif elke 5 seconden naar de volgende slide
setInterval(nextSlide, 5000);

