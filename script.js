// App State
let currentStep = 1;
let currentDPI = 800;
let currentSens = 0.35;
let lowBound = 0.1;
let highBound = 1.0;
let iteration = 0;
let maxIterations = 7;

const DEG_PER_COUNT = 0.02756;

// track last direction to label “Still…” buttons appropriately
let lastFeedback = null;

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  loadDPIHistory();
  initializeEventListeners();
  updateProgress();
});

function initializeEventListeners() {
  // Step 1 - DPI Input
  document
    .getElementById("calculate-btn")
    .addEventListener("click", calculateBaseSensitivity);
  document.getElementById("dpi").addEventListener("input", function () {
    currentDPI = parseInt(this.value) || 800;
  });

  // Step 2 - Initial Test
  document
    .getElementById("too-slow")
    .addEventListener("click", () => initialFeedback("slow"));
  document
    .getElementById("perfect")
    .addEventListener("click", () => initialFeedback("perfect"));
  document
    .getElementById("too-fast")
    .addEventListener("click", () => initialFeedback("fast"));

  // Step 3 - Binary Search
  document
    .getElementById("binary-too-slow")
    .addEventListener("click", () => binaryFeedback("slow"));
  document
    .getElementById("binary-perfect")
    .addEventListener("click", () => binaryFeedback("perfect"));
  document
    .getElementById("binary-too-fast")
    .addEventListener("click", () => binaryFeedback("fast"));

  // Step 4 - Final
  document
    .getElementById("copy-sens")
    .addEventListener("click", copySensitivity);
  document.getElementById("start-over").addEventListener("click", startOver);
}

function calculateBaseSensitivity() {
  currentDPI = parseInt(document.getElementById("dpi").value) || 800;

  // Calculate base sensitivity (target eDPI of 280)
  currentSens = Math.round((280 / currentDPI) * 1000) / 1000;

  // Save DPI to history
  saveDPIToHistory(currentDPI);

  // Update display
  updateSensitivityDisplay();

  // Animate to next step
  goToStep(2);
  updateProgress();
}

function initialFeedback(feedback) {
  // set last feedback immediately for button relabel
  lastFeedback = feedback;
  if (feedback === "perfect") {
    goToStep(4);
    showFinalResult();
    return;
  } else {
    // Setup binary search bounds
    if (feedback === "slow") {
      lowBound = currentSens;
      highBound = Math.min(currentSens * 2, 1.0);
    } else {
      highBound = currentSens;
      lowBound = Math.max(currentSens * 0.5, 0.1);
    }

    iteration = 1;
    goToStep(3);
    updateBinarySearch();
  }
  updateProgress();
}

function binaryFeedback(feedback) {
  // set last feedback immediately for button relabel
  lastFeedback = feedback;
  if (feedback === "perfect") {
    goToStep(4);
    showFinalResult();
  } else {
    if (feedback === "slow") {
      lowBound = currentSens;
    } else {
      highBound = currentSens;
    }

    iteration++;

    if (iteration >= maxIterations) {
      goToStep(4);
      showFinalResult();
    } else {
      updateBinarySearch();
    }
  }
  updateProgress();
}

function updateBinarySearch() {
  // Calculate new sensitivity (middle of bounds)
  currentSens = Math.round(((lowBound + highBound) / 2) * 1000) / 1000;

  // relabel buttons based on lastFeedback
  document.getElementById("binary-too-fast").textContent =
    lastFeedback === "fast" ? "Still Too Fast" : "Too Fast";
  document.getElementById("binary-too-slow").textContent =
    lastFeedback === "slow" ? "Still Too Slow" : "Too Slow";

  // Update displays
  document.getElementById("binary-sens").textContent = currentSens;
  document.getElementById("iteration-count").textContent = iteration;
  document.getElementById("max-iterations").textContent = maxIterations;

  // Update binary search visualization
  updateBinarySearchVisualization();

  // Animate the sensitivity change
  animateSensitivityChange();
}

function updateBinarySearchVisualization() {
  const searchBounds = document.getElementById("search-bounds");
  const searchPointer = document.getElementById("search-pointer");
  const lowLabel = document.getElementById("low-label");
  const highLabel = document.getElementById("high-label");
  const currentValue = document.getElementById("search-current-value");

  // Calculate percentages for visualization
  const totalRange = 1.0 - 0.1; // 0.1 to 1.0
  const boundStart = ((lowBound - 0.1) / totalRange) * 100;
  const boundWidth = ((highBound - lowBound) / totalRange) * 100;
  const pointerPos = ((currentSens - 0.1) / totalRange) * 100;

  // Animate bounds
  gsap.to(searchBounds, {
    left: boundStart + "%",
    width: boundWidth + "%",
    duration: 0.8,
    ease: "power2.out",
  });

  // Animate pointer
  gsap.to(searchPointer, {
    left: pointerPos + "%",
    duration: 0.8,
    ease: "power2.out",
  });

  // Update labels
  lowLabel.textContent = lowBound.toFixed(2);
  highLabel.textContent = highBound.toFixed(2);
  currentValue.textContent = currentSens.toFixed(3);
}

function animateSensitivityChange() {
  const sensElement = document.getElementById("binary-sens");

  // Pulse animation
  gsap.fromTo(
    sensElement,
    { scale: 1 },
    {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    }
  );
}

function showFinalResult() {
  // Calculate eDPI properly - this was the main issue!
  const eDPI = currentDPI * currentSens;

  // Use your existing DEG_PER_COUNT constant
  const inches360 = 360 / (eDPI * DEG_PER_COUNT);
  const cm360 = inches360;

  // Update displays with CALCULATED values, not defaults
  document.getElementById("final-sens").textContent = currentSens;
  document.getElementById("final-dpi").textContent = currentDPI;
  document.getElementById("final-edpi").textContent = Math.round(eDPI);
  document.getElementById("cm-360").textContent = cm360.toFixed(1) + " cm";
  document.getElementById("total-iterations").textContent = iteration;

  // Only update inch-360 if the element exists
  const inchElement = document.getElementById("inch-360");
  if (inchElement) {
    inchElement.textContent = inches360.toFixed(1) + " in";
  }

  celebrateResult();
}

function celebrateResult() {
  const finalSens = document.getElementById("final-sens");

  gsap.fromTo(
    finalSens,
    { scale: 0, rotation: -180 },
    {
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    }
  );
}

function updateSensitivityDisplay() {
  document.getElementById("current-sens").textContent = currentSens;
  document.getElementById("display-dpi").textContent = currentDPI;
  document.getElementById("display-sens").textContent = currentSens;
  document.getElementById("display-edpi").textContent = Math.round(
    currentDPI * currentSens
  );
}

function goToStep(step) {
  currentStep = step;
  document
    .querySelectorAll(".step")
    .forEach((el) => el.classList.remove("active"));
  const el = document.getElementById(`step-${step}`);
  el.classList.add("active");

  // Progress bar
  const pct = (currentStep / 4) * 100;
  gsap.to("#progress-bar", {
    width: pct + "%",
    duration: 0.5,
    ease: "power2.out",
  });
  document.getElementById("progress-text").textContent = `Step ${step} of 4`;

  // Animate step
  gsap.from(el, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" });
}

function updateProgress() {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const progressPercent = (currentStep / 4) * 100;

  gsap.to(progressBar, {
    width: progressPercent + "%",
    duration: 0.6,
    ease: "power2.out",
  });

  progressText.textContent = `Step ${currentStep} of 4`;
}

function copySensitivity() {
  const textToCopy = `DPI: ${currentDPI}, Sensitivity: ${currentSens}, eDPI: ${Math.round(
    currentDPI * currentSens
  )}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const button = document.getElementById("copy-sens");
    const originalText = button.textContent;
    button.textContent = "✅ Copied!";
    button.classList.add("pulse");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("pulse");
    }, 2000);
  });
}

function startOver() {
  currentStep = 1;
  currentSens = 0.35;
  lowBound = 0.1;
  highBound = 1.0;
  iteration = 0;

  goToStep(1);
  updateProgress();

  // Reset DPI input
  document.getElementById("dpi").value = currentDPI;
}

// DPI History Management (using variables instead of localStorage)
let dpiHistory = [];

function saveDPIToHistory(dpi) {
  if (!dpiHistory.includes(dpi)) {
    dpiHistory.unshift(dpi);
    dpiHistory = dpiHistory.slice(0, 5); // Keep only 5 most recent
    updateDPIHistory();
  }
}

function loadDPIHistory() {
  // Initialize with common values
  dpiHistory = [800, 400, 1600];
  updateDPIHistory();
}

function updateDPIHistory() {
  const historyDiv = document.getElementById("dpi-history");
  const buttonsDiv = document.getElementById("dpi-buttons");

  if (dpiHistory.length > 0) {
    historyDiv.classList.remove("hidden");
    buttonsDiv.innerHTML = "";

    dpiHistory.forEach((dpi) => {
      const button = document.createElement("button");
      button.className =
        "text-xs px-3 py-1 bg-valorantRed/20 text-valorantRed rounded-full hover:bg-valorantRed/30 transition";
      button.textContent = dpi;
      button.onclick = () => {
        document.getElementById("dpi").value = dpi;
        currentDPI = dpi;
      };
      buttonsDiv.appendChild(button);
    });
  }
}

// Initial animations
gsap.from("header", {
  y: -50,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

gsap.from(".glass-card", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  delay: 0.3,
  stagger: 0.2,
  ease: "power2.out",
});

// Video fallback handler
const video = document.querySelector("video");
if (video) {
  video.addEventListener("error", function () {
    console.log("Local video failed, using fallback");
  });
}
