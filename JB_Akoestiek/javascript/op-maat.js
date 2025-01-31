/** SAMPLE PRINTS DATABASE (fabric + color) **/
const PRINTS_DB = [
  { src: "images/stoffen/Katoen-kleuren/donkerbeige.jpg", alt: "Donkerbeige", typeStof: "Katoen", color: "Brown" },
  { src: "images/stoffen/Katoen-kleuren/ecru.jpg", alt: "Ecru", typeStof: "Katoen", color: "Grey" },
  { src: "images/stoffen/Katoen-kleuren/geel.jpg", alt: "Geel", typeStof: "Katoen", color: "Yellow" },
  { src: "images/stoffen/Katoen-kleuren/grasgroen.jpg", alt: "Grasgroen", typeStof: "Katoen", color: "Green" },
  { src: "images/stoffen/Katoen-kleuren/kobaltblauw.jpg", alt: "Kobalt Blauw", typeStof: "Katoen", color: "Blue" },
  { src: "images/stoffen/Katoen-kleuren/turquoise.jpg", alt: "Turquoise", typeStof: "Katoen", color: "Blue" },
  { src: "images/stoffen/Katoen-kleuren/lime.jpg", alt: "Lime", typeStof: "Katoen", color: "Green" },
  { src: "images/stoffen/Katoen-kleuren/oranje.jpg", alt: "Oranje", typeStof: "Katoen", color: "Orange" },
  { src: "images/stoffen/Katoen-kleuren/paars.jpg", alt: "Paars", typeStof: "Katoen", color: "Purple" },
  { src: "images/stoffen/Katoen-kleuren/rood.jpg", alt: "Red", typeStof: "Katoen", color: "Red" },
  { src: "images/stoffen/Katoen-kleuren/wit.jpg", alt: "White", typeStof: "Katoen", color: "White" },
  { src: "images/stoffen/Katoen-kleuren/zwart.jpg", alt: "Black", typeStof: "Katoen", color: "Black" },
];

/** EXAMPLE STOF FACTORS for price calc **/
const STOF_FACTOR = {
  Katoen: 1.2,
  Polyester: 1.5,
  Stof3: 1.8,
  Stof4: 2.0
};

/***********************************************************
 * 1) SHAPE SELECTION => store data-shape in hidden input
 ***********************************************************/
function initShapeSelection(panelOrderDiv) {
  const shapeOptions = panelOrderDiv.querySelectorAll(".shape-option");
  const shapeHidden = panelOrderDiv.querySelector(".shapeHidden");

  shapeOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      // Clear selected on siblings
      shapeOptions.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      shapeHidden.value = opt.dataset.shape;
      // Recalculate price in case we now have a shape
      calculatePrice(panelOrderDiv);
    });
  });
}

/***********************************************************
 * 2) FABRIC BUTTONS & COLOR => filter prints
 ***********************************************************/
function updatePrintItems(panelOrderDiv) {
  const typeStofButtons = panelOrderDiv.querySelectorAll(".typeStof .selector-button");
  const colorChecks = panelOrderDiv.querySelectorAll(".colorFilter:checked");
  const printsWrap = panelOrderDiv.querySelector(".print-items");
  const printHidden = panelOrderDiv.querySelector(".printHidden");

  // Remember which print was previously selected (if any)
  const currentlySelectedAlt = printHidden.value;

  // Get the selected fabric
  const selectedFabricButton = Array.from(typeStofButtons).find(btn => btn.classList.contains("selected"));
  const stofValue = selectedFabricButton ? selectedFabricButton.getAttribute("value") : "";

  // Gather selected colors
  const chosenColors = Array.from(colorChecks).map(ch => ch.value);

  // Filter from PRINTS_DB
  const filtered = PRINTS_DB.filter(p => {
    if (stofValue && p.typeStof !== stofValue) return false;
    if (chosenColors.length > 0 && !chosenColors.includes(p.color)) return false;
    return true;
  });

  // Clear existing prints in the slider
  printsWrap.innerHTML = "";

  // Rebuild items
  filtered.forEach(printObj => {
    const div = document.createElement("div");
    div.className = "print-item";
    div.innerHTML = `<img src="${printObj.src}" alt="${printObj.alt}" />`;

    // If this print was already selected, reselect it
    if (printObj.alt === currentlySelectedAlt) {
      div.classList.add("selected");
    }

    div.addEventListener("click", () => {
      // De-select siblings
      printsWrap.querySelectorAll(".print-item").forEach(i => i.classList.remove("selected"));
      div.classList.add("selected");
      printHidden.value = printObj.alt;
      
      // Update fabric type based on selected print
      const fabricType = printObj.typeStof;
      typeStofButtons.forEach(btn => {
        if (btn.getAttribute("value") === fabricType) {
          btn.classList.add("selected");
        } else {
          btn.classList.remove("selected");
        }
      });
      
      // Recalculate price with the new fabric type
      calculatePrice(panelOrderDiv);
    });
    printsWrap.appendChild(div);
  });
}

function initFabricButtons(panelOrderDiv) {
  const typeStofButtons = panelOrderDiv.querySelectorAll(".typeStof .selector-button");

  typeStofButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // ensure no form submit
      // Clear selection on all buttons
      typeStofButtons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      
      // Update prints based on the selected fabric
      updatePrintItems(panelOrderDiv);
      // Recalculate price in case fabric factor changes
      calculatePrice(panelOrderDiv);
    });
  });

  // Initialize color filter listeners
  const colorChecks = panelOrderDiv.querySelectorAll(".colorFilter");
  colorChecks.forEach(chk => {
    // Just recalc on change; doesn't submit form
    chk.addEventListener("change", () => {
      updatePrintItems(panelOrderDiv);
      calculatePrice(panelOrderDiv);
    });
  });

  // Initialize print slider
  initPrintSlider(panelOrderDiv);
}

/***********************************************************
 * 3) PRINT SLIDER
 ***********************************************************/
function initPrintSlider(panelOrderDiv) {
  const printItems = panelOrderDiv.querySelector(".print-items");
  const leftArrow = panelOrderDiv.querySelector(".arrowLeft");
  const rightArrow = panelOrderDiv.querySelector(".arrowRight");
  
  if (!printItems || !leftArrow || !rightArrow) return;

  const scrollAmount = 200;

  leftArrow.addEventListener("click", () => {
    printItems.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  rightArrow.addEventListener("click", () => {
    printItems.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
}

/***********************************************************
 * 4) PRICE CALC
 ***********************************************************/
function calculatePrice(panelOrderDiv) {
  // NEW: shape must be selected
  const shapeValue = panelOrderDiv.querySelector(".shapeHidden").value;
  if (!shapeValue) {
    // If no shape is selected, clear the price and exit
    panelOrderDiv.querySelector(".price-field").value = "";
    return;
  }

  // Continue the existing logic
  const selectedPrint = panelOrderDiv.querySelector(".print-item.selected");
  if (!selectedPrint) {
    panelOrderDiv.querySelector(".price-field").value = "";
    return;
  }

  const printAlt = selectedPrint.querySelector("img").alt;
  const printData = PRINTS_DB.find(p => p.alt === printAlt);
  if (!printData || !STOF_FACTOR[printData.typeStof]) {
    panelOrderDiv.querySelector(".price-field").value = "";
    return;
  }

  const lengthVal = parseFloat(panelOrderDiv.querySelector(".length").value) || 0;
  const widthVal = parseFloat(panelOrderDiv.querySelector(".width").value) || 0;
  const thickVal = parseFloat(panelOrderDiv.querySelector(".thickness").value) || 0;
  const qtyVal = parseFloat(panelOrderDiv.querySelector(".quantity").value) || 0;

  const priceField = panelOrderDiv.querySelector(".price-field");

  // If any dimension or quantity is missing, no price
  if (!lengthVal || !widthVal || !thickVal || !qtyVal) {
    priceField.value = "";
    return;
  }

  const factor = STOF_FACTOR[printData.typeStof];
  // Example formula
  const calc = factor * ((lengthVal * widthVal * thickVal) / 1000) * qtyVal;

  priceField.value = "€ " + calc.toFixed(2);
}

/***********************************************************
 * 5) LENGTH & WIDTH SLIDERS
 ***********************************************************/
function initSliders(panelOrderDiv) {
  const lengthSlider = panelOrderDiv.querySelector(".length-slider");
  const lengthInput = panelOrderDiv.querySelector(".length");
  const widthSlider = panelOrderDiv.querySelector(".width-slider");
  const widthInput = panelOrderDiv.querySelector(".width");

  // Sync slider and input for length
  lengthSlider.addEventListener("input", () => {
    lengthInput.value = lengthSlider.value;
    calculatePrice(panelOrderDiv);
  });

  lengthInput.addEventListener("input", () => {
    if (lengthInput.value >= 15 && lengthInput.value <= 250) {
      lengthSlider.value = lengthInput.value;
      calculatePrice(panelOrderDiv);
    }
  });

  // Sync slider and input for width
  widthSlider.addEventListener("input", () => {
    widthInput.value = widthSlider.value;
    calculatePrice(panelOrderDiv);
  });

  widthInput.addEventListener("input", () => {
    if (widthInput.value >= 15 && widthInput.value <= 250) {
      widthSlider.value = widthInput.value;
      calculatePrice(panelOrderDiv);
    }
  });
}

/***********************************************************
 * 6) THICKNESS BUTTONS
 ***********************************************************/
function initThicknessButtons(panelOrderDiv) {
  const thicknessButtons = panelOrderDiv.querySelectorAll(".thickness-button");
  const thicknessHidden = panelOrderDiv.querySelector(".thickness");

  thicknessButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // ensures no form submission
      // Clear selected state on all buttons
      thicknessButtons.forEach(btn => btn.classList.remove("selected"));
      // Mark the clicked button as selected
      button.classList.add("selected");
      // Update the hidden input with the selected thickness
      thicknessHidden.value = button.dataset.thickness;
      // Recalculate the price
      calculatePrice(panelOrderDiv);
    });
  });
}

/***********************************************************
 * 7) INIT A SINGLE PANEL-ORDER
 ***********************************************************/
function initPanelOrder(panelOrderDiv) {
  // Shape
  initShapeSelection(panelOrderDiv);

  // Fabric buttons
  initFabricButtons(panelOrderDiv);

  // Thickness buttons
  initThicknessButtons(panelOrderDiv);

  // Dimensions => recalc price
  const dimFields = panelOrderDiv.querySelectorAll(".length, .width, .thickness, .quantity");
  dimFields.forEach(f => {
    f.addEventListener("input", () => calculatePrice(panelOrderDiv));
  });

  // Initialize sliders
  initSliders(panelOrderDiv);

  // Initialize prints
  updatePrintItems(panelOrderDiv);
}

/***********************************************************
 * 8) ADD / REMOVE MULTIPLE PANELS
 ***********************************************************/
const masterForm = document.getElementById("masterForm");
const addPanelButton = masterForm.querySelector(".add-panel-btn");

addPanelButton.addEventListener("click", () => {
  const allPanels = masterForm.querySelectorAll(".panel-order");
  const lastPanel = allPanels[allPanels.length - 1];
  const newPanel = lastPanel.cloneNode(true);

  // Reset all inputs in the new panel
  newPanel.querySelector(".shapeHidden").value = "";
  newPanel.querySelectorAll(".shape-option").forEach(o => o.classList.remove("selected"));
  newPanel.querySelectorAll(".typeStof .selector-button").forEach(btn => btn.classList.remove("selected"));
  newPanel.querySelectorAll(".colorFilter").forEach(chk => { chk.checked = false; });
  newPanel.querySelector(".print-items").innerHTML = "";
  newPanel.querySelector(".printHidden").value = "";
  newPanel.querySelector(".length").value = "15";
  newPanel.querySelector(".width").value = "15";
  newPanel.querySelector(".thickness").value = "";
  newPanel.querySelector(".quantity").value = "1";
  newPanel.querySelector(".price-field").value = "";
  newPanel.querySelectorAll(".thickness-button").forEach(btn => btn.classList.remove("selected"));

  // Show remove button
  const removeBtn = newPanel.querySelector(".remove-panel-btn");
  removeBtn.style.display = "inline-block";
  removeBtn.addEventListener("click", () => {
    newPanel.remove();
  });

  // Insert before the add button
  lastPanel.parentNode.insertBefore(newPanel, addPanelButton);

  // Initialize the new panel
  initPanelOrder(newPanel);
});

// Initialize the first panel
const firstPanel = masterForm.querySelector(".panel-order");
initPanelOrder(firstPanel);
// Hide remove button on the very first panel
firstPanel.querySelector(".remove-panel-btn").style.display = "none";

// Form submission handler
masterForm.addEventListener("submit", e => {
  e.preventDefault();
  
  const panelOrders = masterForm.querySelectorAll(".panel-order");
  if (panelOrders.length === 0) {
    alert("Er moet minimaal één paneel worden besteld!");
    return;
  }

  // Only validate required fields when actually submitting the order
  let isValid = true;
  panelOrders.forEach(panel => {
    const shape = panel.querySelector(".shapeHidden").value;
    const fabric = panel.querySelector(".typeStof .selector-button.selected");
    const thickness = panel.querySelector(".thickness").value;
    
    if (!shape || !fabric || !thickness) {
      isValid = false;
    }
  });

  if (!isValid) {
    alert("Vul alle verplichte velden in voor elk paneel.");
    return;
  }

  // If everything is valid, show the order confirmation
  alert("Bestelling wordt verzonden (demo)...");
});
