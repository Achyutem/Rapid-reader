const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const inputElement = document.getElementById("input");
const outputElement = document.getElementById("output");
const processBtn = document.getElementById("process-btn");
const clearBtn = document.getElementById("clear-btn");
const fontSizeInput = document.getElementById("font-size");
const sizeValue = document.getElementById("size-value");
const copyBtn = document.getElementById("copy-btn");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const referralSource = getQueryParam("ref");
if (referralSource) {
  gtag("event", "custom_referral", {
    referral_source: referralSource,
  });
}

const sampleText = `If you can keep your head when all about you
Are losing theirs and blaming it on you,
If you can trust yourself when all men doubt you,
But make allowance for their doubting too;
If you can wait and not be tired by waiting,
Or being lied about, don’t deal in lies,
Or being hated, don’t give way to hating,
And yet don’t look too good, nor talk too wise:`;

document.getElementById("extension").addEventListener("click", function () {
  window.open("https://github.com/achyutem/radid-reader-extension", "_blank");
});

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
  input = input.replace(/<\/?b>/g, "");
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
    if (word.trim() === "") {
      result += word;
      continue;
    }
    result += applyBionicReading(word);
  }
  return result;
}

function applyBionicReading(word) {
  const cleanWord = word.replace(/[^a-zA-Z0-9']/g, "");
  const len = cleanWord.length;

  if (len === 0) return word;

  let boldLength;
  if (len <= 2) {
    boldLength = 1;
  } else if (len <= 4) {
    boldLength = Math.ceil(len * 0.5);
  } else if (len <= 7) {
    boldLength = Math.ceil(len * 0.45);
  } else {
    boldLength = Math.ceil(len * 0.4);
  }

  const boldPart = word.substr(0, boldLength);
  const restPart = word.substr(boldLength);
  return `<b>${boldPart}</b>${restPart}`;
}

// Update font size
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

copyBtn.addEventListener("click", async () => {
  const htmlContent = outputElement.innerHTML;
  const plainTextContent = outputElement.innerText;

  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const blobHtml = new Blob([htmlContent], { type: "text/html" });
      const blobText = new Blob([plainTextContent], { type: "text/plain" });

      const clipboardItem = new ClipboardItem({
        "text/html": blobHtml,
        "text/plain": blobText,
      });

      await navigator.clipboard.write([clipboardItem]);

      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy Text";
      }, 2000);
    } catch (err) {
      console.error("Clipboard write failed:", err);
      fallbackCopy();
    }
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const temp = document.createElement("textarea");
    temp.value = plainTextContent;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    copyBtn.textContent = "Copied (Fallback)";
    setTimeout(() => {
      copyBtn.textContent = "Copy Text";
    }, 2000);
  }
});

processBtn.addEventListener("click", processInput);
clearBtn.addEventListener("click", () => {
  inputElement.value = "";
  outputElement.innerHTML = "";
});
fontSizeInput.addEventListener("input", updateFontSize);

window.addEventListener("DOMContentLoaded", () => {
  loadFontPreferences();
  if (!inputElement.value.trim()) {
    inputElement.value = sampleText;
    processInput();
  }
});
