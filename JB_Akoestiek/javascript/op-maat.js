/********************************************************************
 * Example of how you could integrate the new logic
 * This is just a DEMO snippet; you'll merge with your existing code
 ********************************************************************/

/** SAMPLE PRINTS DATABASE (fabric + color) **/
const PRINTS_DB = [
  { src: "images/stoffen/Katoen-kleuren/donkerbeige.jpg", alt: "Donkerbeige",
      typeStof: "Katoen", color: "Brown" },
  { src: "images/stoffen/Katoen-kleuren/ecru.jpg", alt: "Ecru",
      typeStof: "Katoen", color: "Grey" },
  { src: "images/stoffen/Katoen-kleuren/geel.jpg", alt: "Geel",
      typeStof: "Katoen", color: "Yellow" },
  { src: "images/stoffen/Katoen-kleuren/grasgroen.jpg", alt: "Grasgroen",
      typeStof: "Katoen", color: "Green" },
  { src: "images/stoffen/Katoen-kleuren/kobaltblauw.jpg", alt: "Kobalt Blauw",
      typeStof: "Katoen", color: "Blue" },
      { src: "images/stoffen/Katoen-kleuren/turquoise.jpg", alt: "Turquoise",
        typeStof: "Katoen", color: "Blue" },
  { src: "images/stoffen/Katoen-kleuren/lime.jpg", alt: "Lime",   
      typeStof: "Katoen", color: "Green" },
  { src: "images/stoffen/Katoen-kleuren/oranje.jpg", alt: "Oranje", 
      typeStof: "Katoen",  color: "Orange" },
  { src: "images/stoffen/Katoen-kleuren/paars.jpg", alt: "Paars",
      typeStof: "Katoen", color: "Purple" },
  { src: "images/stoffen/Katoen-kleuren/rood.jpg", alt: "Red",   
      typeStof: "Katoen", color: "Red" },
  { src: "images/stoffen/Katoen-kleuren/wit.jpg", alt: "White", 
      typeStof: "Katoen",  color: "White" },
  { src: "images/stoffen/Katoen-kleuren/zwart.jpg", alt: "Black", 
      typeStof: "Katoen",  color: "Black" },



  { src: "https://via.placeholder.com/60/808080?text=S3-2", alt: "Stof3 Grey #2",  typeStof: "Stof3",  color: "Grey" },
  { src: "https://via.placeholder.com/60/FFF000?text=S4-1", alt: "Stof4 Yellow#1", typeStof: "Stof4",  color: "Yellow" }
];

/** EXAMPLE STOF FACTORS for price calc **/
const STOF_FACTOR = {
  Katoen: 1.2,
  Polyester: 1.5,
  Stof3:  1.8,
  Stof4:  2.0
};

/***********************************************************
 * 1) SHAPE SELECTION => store data-shape in hidden input
 ***********************************************************/
function initShapeSelection(panelOrderDiv) {
  const shapeOptions = panelOrderDiv.querySelectorAll(".shape-option");
  const shapeHidden  = panelOrderDiv.querySelector(".shapeHidden");

  shapeOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      // Clear selected on siblings
      shapeOptions.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      shapeHidden.value = opt.dataset.shape;
    });
  });
}

/***********************************************************
 * 2) FABRIC & COLOR => filter prints
 ***********************************************************/
function updatePrintItems(panelOrderDiv) {
  const typeStofSelect = panelOrderDiv.querySelector(".typeStof");
  const colorChecks    = panelOrderDiv.querySelectorAll(".colorFilter:checked");
  const printsWrap     = panelOrderDiv.querySelector(".print-items");
  const printHidden    = panelOrderDiv.querySelector(".printHidden");

  // Gather selected data
  const stofValue = typeStofSelect.value;
  const chosenColors = Array.from(colorChecks).map(ch => ch.value);
  const colorFilterActive = (chosenColors.length > 0);

  // Filter from PRINTS_DB
  const filtered = PRINTS_DB.filter(p => {
    if (stofValue && p.typeStof !== stofValue) return false;
    if (colorFilterActive && !chosenColors.includes(p.color)) return false;
    return true;
  });

  // Clear existing
  printsWrap.innerHTML = "";
  printHidden.value = "";

  // Rebuild items
  filtered.forEach(printObj => {
    const div = document.createElement("div");
    div.className = "print-item";
    div.innerHTML = `<img src="${printObj.src}" alt="${printObj.alt}" />`;
    div.addEventListener("click", () => {
      // De-select siblings
      printsWrap.querySelectorAll(".print-item").forEach(i => i.classList.remove("selected"));
      div.classList.add("selected");
      printHidden.value = printObj.alt; // or store 'src', up to you
    });
    printsWrap.appendChild(div);
  });
}

/***********************************************************
 * 3) PRICE CALC
 * Example formula:
 * price = STOF_FACTOR[typeStof] * ((length * width * thickness)/1000) * quantity
 ***********************************************************/
function calculatePrice(panelOrderDiv) {
  const typeStof    = panelOrderDiv.querySelector(".typeStof").value;
  const lengthVal   = parseFloat(panelOrderDiv.querySelector(".length").value) || 0;
  const widthVal    = parseFloat(panelOrderDiv.querySelector(".width").value)  || 0;
  const thickVal    = parseFloat(panelOrderDiv.querySelector(".thickness").value) || 0;
  const qtyVal      = parseFloat(panelOrderDiv.querySelector(".quantity").value)   || 0;

  const priceField  = panelOrderDiv.querySelector(".price-field");

  if (!typeStof || !lengthVal || !widthVal || !thickVal || !qtyVal) {
    priceField.value = "";
    return;
  }

  const factor = STOF_FACTOR[typeStof] || 1.0;
  const calc   = factor * ((lengthVal * widthVal * thickVal) / 1000) * qtyVal;

  priceField.value = "€ " + calc.toFixed(2);
}

/***********************************************************
 * 4) SLIDER CONTROL
 ***********************************************************/
function initSlider(panelOrderDiv) {
  const arrowLeft  = panelOrderDiv.querySelector(".arrowLeft");
  const arrowRight = panelOrderDiv.querySelector(".arrowRight");
  const printItems = panelOrderDiv.querySelector(".print-items");

  let scrollPos = 0;
  arrowLeft.addEventListener("click", () => {
    scrollPos -= 60;
    if (scrollPos < 0) scrollPos = 0;
    printItems.style.transform = `translateX(${-scrollPos}px)`;
  });
  arrowRight.addEventListener("click", () => {
    scrollPos += 60;
    // Could add a max-limit check
    printItems.style.transform = `translateX(${-scrollPos}px)`;
  });
}

/***********************************************************
 * 5) INIT A SINGLE PANEL-ORDER
 ***********************************************************/
function initPanelOrder(panelOrderDiv) {
  // Shape
  initShapeSelection(panelOrderDiv);

  // Fabric / color => update prints
  const typeStofSelect = panelOrderDiv.querySelector(".typeStof");
  const colorChecks    = panelOrderDiv.querySelectorAll(".colorFilter");
  typeStofSelect.addEventListener("change", () => {
    updatePrintItems(panelOrderDiv);
    calculatePrice(panelOrderDiv);
  });
  colorChecks.forEach(chk => {
    chk.addEventListener("change", () => {
      updatePrintItems(panelOrderDiv);
    });
  });

  // Dimensions => recalc price
  const dimFields = panelOrderDiv.querySelectorAll(".length, .width, .thickness, .quantity");
  dimFields.forEach(f => {
    f.addEventListener("input", () => calculatePrice(panelOrderDiv));
  });

  // Slider
  initSlider(panelOrderDiv);

  // On init, set prints (empty if no stof chosen)
  updatePrintItems(panelOrderDiv);
}

/***********************************************************
 * 6) ADD / REMOVE MULTIPLE PANELS
 ***********************************************************/
const masterForm     = document.getElementById("masterForm");
const addPanelButton = masterForm.querySelector(".add-panel-btn");

addPanelButton.addEventListener("click", () => {
  // Grab the last .panel-order
  const allPanels = masterForm.querySelectorAll(".panel-order");
  const lastPanel = allPanels[allPanels.length - 1];
  const newPanel  = lastPanel.cloneNode(true);

  // Clear user input in newPanel
  // shape
  newPanel.querySelector(".shapeHidden").value = "";
  newPanel.querySelectorAll(".shape-option").forEach(o => o.classList.remove("selected"));

  // typeStof
  newPanel.querySelector(".typeStof").value = "";
  // color checkboxes
  newPanel.querySelectorAll(".colorFilter").forEach(chk => { chk.checked = false; });
  // prints
  newPanel.querySelector(".print-items").innerHTML = "";
  newPanel.querySelector(".printHidden").value = "";

  // dimension fields
  newPanel.querySelector(".length").value = "";
  newPanel.querySelector(".width").value  = "";
  newPanel.querySelector(".thickness").value = "";
  newPanel.querySelector(".quantity").value = 1;
  // price
  newPanel.querySelector(".price-field").value = "";

  // "Remove" button
  const removeBtn = newPanel.querySelector(".remove-panel-btn");
  removeBtn.style.display = "inline-block";
  removeBtn.addEventListener("click", () => {
    newPanel.remove();
  });

  // Insert before the addPanelBtn
  lastPanel.parentNode.insertBefore(newPanel, addPanelButton);

  // Re-init this new panel's event listeners
  initPanelOrder(newPanel);
});

// Initialize the FIRST panel
const firstPanel = masterForm.querySelector(".panel-order");
initPanelOrder(firstPanel);
// Hide the remove button on the first panel
firstPanel.querySelector(".remove-panel-btn").style.display = "none";

// On form submit, basic validation
masterForm.addEventListener("submit", e => {
  const panelOrders = masterForm.querySelectorAll(".panel-order");
  if (panelOrders.length === 0) {
    alert("Er moet minimaal één paneel worden besteld!");
    e.preventDefault();
    return;
  }
  // Additional checks as desired
  alert("Bestelling wordt verzonden (demo)...");
});