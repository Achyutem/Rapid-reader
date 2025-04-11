const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const inputElement = document.getElementById("input");
const outputElement = document.getElementById("output");
const processBtn = document.getElementById("process-btn");
const clearBtn = document.getElementById("clear-btn");
const fontSizeInput = document.getElementById("font-size");
const sizeValue = document.getElementById("size-value");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeIcon.textContent = "🌙";
}

function processInput() {
  let input = inputElement.value;
  if (!input.trim()) {
    outputElement.innerHTML = "";
    return;
  }

  // Remove any existing bold tags
  input = input.replace(/<\/?b>/g, "");

  // Process text while preserving line breaks
  const lines = input.split("\n");
  const processedLines = lines.map((line) => {
    if (line.trim() === "") return "";
    return processLine(line);
  });

  outputElement.innerHTML = processedLines.join("<br>");
  updateFontSize();
}

function processLine(line) {
  let words = line.split(/(\s+)/);
  let result = "";

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // Skip spaces and preserve them
    if (word.trim() === "") {
      result += word;
      continue;
    }

    // Apply bolding based on word length
    if (word.length <= 3) {
      result += "<b>" + word + "</b>";
    } else if (word.length === 4) {
      result += "<b>" + word.substr(0, 2) + "</b>" + word.substr(2);
    } else if (word.length >= 5 && word.length <= 6) {
      result += "<b>" + word.substr(0, 3) + "</b>" + word.substr(3);
    } else {
      result += "<b>" + word.substr(0, 4) + "</b>" + word.substr(4);
    }
  }

  return result;
}

function updateFontSize() {
  const fontSize = fontSizeInput.value;
  outputElement.style.fontSize = `${fontSize}px`;
  sizeValue.textContent = `${fontSize}px`;
  localStorage.setItem("fontSize", fontSize);
}

function loadFontPreferences() {
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    fontSizeInput.value = savedFontSize;
    updateFontSize();
  } else {
    updateFontSize();
  }
}

processBtn.addEventListener("click", processInput);
clearBtn.addEventListener("click", () => {
  inputElement.value = "";
  outputElement.innerHTML = "";
});
fontSizeInput.addEventListener("input", updateFontSize);

window.addEventListener("DOMContentLoaded", () => {
  loadFontPreferences();
  if (inputElement.value.trim()) {
    processInput();
  }
});
