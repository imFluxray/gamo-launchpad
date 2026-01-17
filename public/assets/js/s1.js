// Ads
// settings.js
document.addEventListener("DOMContentLoaded", () => {
  function adChange(selectedValue) {
    if (selectedValue === "default") {
      localStorage.setItem("ads", "on");
    } else if (selectedValue === "popups") {
      localStorage.setItem("ads", "popups");
    } else if (selectedValue === "off") {
      localStorage.setItem("ads", "off");
    }
  }

  const adTypeElement = document.getElementById("adType");

  if (adTypeElement) {
    adTypeElement.addEventListener("change", function () {
      const selectedOption = this.value;
      adChange(selectedOption);
    });

    const storedAd = localStorage.getItem("ads");
    if (storedAd === "on") {
      adTypeElement.value = "default";
    } else if (storedAd === "popups") {
      adTypeElement.value = "popups";
    } else if (storedAd === "off") {
      adTypeElement.value = "off";
    } else {
      adTypeElement.value = "default";
    }
  }
  // Makes the custom icon and name persistent
  const iconElement = document.getElementById("icon");
  const nameElement = document.getElementById("name");
  const customIcon = localStorage.getItem("CustomIcon");
  const customName = localStorage.getItem("CustomName");
  iconElement.value = customIcon;
  nameElement.value = customName;

  if (localStorage.getItem("ab") === "true") {
    document.getElementById("ab-settings-switch").checked = true;
  }
});

// Dyn
document.addEventListener("DOMContentLoaded", () => {
  function pChange(selectedValue) {
    if (selectedValue === "uv") {
      localStorage.setItem("uv", "true");
      localStorage.setItem("dy", "false");
    } else if (selectedValue === "dy") {
      localStorage.setItem("uv", "false");
      localStorage.setItem("dy", "true");
    }
  }

  const pChangeElement = document.getElementById("pChange");

  if (pChangeElement) {
    pChangeElement.addEventListener("change", function () {
      const selectedOption = this.value;
      pChange(selectedOption);
    });

    const storedP = localStorage.getItem("uv");
    if (storedP === "true") {
      pChangeElement.value = "uv";
    } else if (localStorage.getItem("dy") === "true" || localStorage.getItem("dy") === "auto") {
      pChangeElement.value = "dy";
    } else {
      pChangeElement.value = "uv";
    }
  }
});

// Key
let eventKey = localStorage.getItem("eventKey") || "`";
let eventKeyRaw = localStorage.getItem("eventKeyRaw") || "`";
let pLink = localStorage.getItem("pLink") || "https://classroom.google.com/";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("eventKeyInput").value = eventKeyRaw;
  document.getElementById("linkInput").value = pLink;

  const selectedOption = localStorage.getItem("selectedOption");
  if (selectedOption) {
    updateHeadSection(selectedOption);
  }
});

const eventKeyInput = document.getElementById("eventKeyInput");
eventKeyInput.addEventListener("input", () => {
  eventKey = eventKeyInput.value.split(",");
});

const linkInput = document.getElementById("linkInput");
linkInput.addEventListener("input", () => {
  pLink = linkInput.value;
});

function saveEventKey() {
  eventKey = eventKeyInput.value.split(",");
  eventKeyRaw = eventKeyInput.value;
  localStorage.setItem("eventKey", JSON.stringify(eventKey));
  
  // Fix: Ensure protocol exists
  let savedLink = linkInput.value;
  if (savedLink && !savedLink.startsWith("http")) {
    savedLink = "https://" + savedLink;
  }
  
  localStorage.setItem("pLink", savedLink);
  localStorage.setItem("eventKeyRaw", eventKeyRaw);
  window.location.reload(); 
}
const dropdown = document.getElementById("dropdown");
const options = dropdown.getElementsByTagName("option");

const sortedOptions = Array.from(options).sort((a, b) => a.textContent.localeCompare(b.textContent));

while (dropdown.firstChild) {
  dropdown.removeChild(dropdown.firstChild);
}

for (const option of sortedOptions) {
  dropdown.appendChild(option);
}

// Toast helper
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function saveCloak() {
  const iconElement = document.getElementById("icon"); 
  const nameElement = document.getElementById("name");
  
  const dropdown = document.getElementById("dropdown");
  if (!dropdown) return;

  const selectedValue = dropdown.value;
  localStorage.setItem("selectedOption", selectedValue);

  // Show custom toast instead of alert
  showToast("Cloak Applied Successfully!");
  
  // Reload after a short delay to let user see the toast
  setTimeout(() => {
    location.reload(); 
  }, 1000);
}

function ResetCustomCloak() {
  localStorage.removeItem("CustomName");
  localStorage.removeItem("CustomIcon");
  localStorage.setItem("selectedOption", "Default");
  // document.getElementById("icon").value = ""; 
  // document.getElementById("name").value = "";
  location.reload();
}
function ResetCustomCloak() {
  localStorage.removeItem("CustomName");
  localStorage.removeItem("CustomIcon");
  document.getElementById("icon").value = "";
  document.getElementById("name").value = "";
}

function redirectToMainDomain() {
  /*
  const currentUrl = window.location.href;
  const mainDomainUrl = currentUrl.replace(/\/[^/]*$/, "");
  const target = mainDomainUrl + window.location.pathname;
  if (window !== top) {
    try {
      top.location.href = target;
    } catch {
      try {
        parent.location.href = target;
      } catch {
        window.location.href = target;
      }
    }
  } else window.location.href = mainDomainUrl + window.location.pathname;
  */
  console.log("Frame busting disabled for About:Blank compatibility");
}

document.addEventListener("DOMContentLoaded", event => {
  const icon = document.getElementById("tab-favicon");
  const name = document.getElementById("t");
  const selectedValue = localStorage.getItem("selectedOption") || "Default";
  document.getElementById("dropdown").value = selectedValue;
  updateHeadSection(selectedValue);
});

// Removed handleDropdownChange to prevent auto-save
// function handleDropdownChange(selectElement) { ... }

const cloaks = {
  "Default": { title: "Gamo Launchpad", icon: "favicon.png" },
  "Google": { title: "Google", icon: "https://www.google.com/favicon.ico" },
  "Drive": { title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png" },
  "Classroom": { title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
  "Gmail": { title: "Gmail", icon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" },
  "Google Meet": { title: "Google Meet", icon: "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/48dp/web/meet_2020q4_48dp.png" },
  "Google Docs": { title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  "Google Slides": { title: "Google Slides", icon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  "Canvas": { title: "Dashboard", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
  "Schoology": { title: "Home | Schoology", icon: "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico" },
  "Khan": { title: "Dashboard | Khan Academy", icon: "https://www.khanacademy.org/favicon.ico" },
  "Clever": { title: "Clever | Portal", icon: "https://assets.clever.com/launchpad/c6366b/favicon.ico" },
  "IXL": { title: "IXL | Dashboard", icon: "https://www.ixl.com/ixl-favicon.png" },
  "Edpuzzle": { title: "Edpuzzle", icon: "https://edpuzzle.com/favicon.ico" },
  "Desmos": { title: "Desmos | Graphing Calculator", icon: "https://www.desmos.com/favicon.ico" },
  "Wikipedia": { title: "Wikipedia", icon: "https://en.wikipedia.org/static/favicon/wikipedia.ico" },
  "Dictionary": { title: "Dictionary.com", icon: "https://www.dictionary.com/favicon.ico" },
  "Bing": { title: "Bing", icon: "https://www.bing.com/favicon.ico" },
  "Pandora": { title: "Pandora", icon: "https://www.pandora.com/img/favicon/favicon-32.png" },
  "Spotify": { title: "Spotify", icon: "https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico" },
  // Add other mappings as needed, falling back to Google if unknown
};

function updateHeadSection(selectedValue) {
  // Helper to set title/icon on a document
  const setCloak = (doc, title, iconUrl) => {
    if (!doc) return;
    doc.title = title;
    // Try to find existing favicon or create new one
    let fav = doc.querySelector("link[rel*='icon']") || doc.getElementById("tab-favicon");
    if (!fav) {
      fav = doc.createElement("link");
      fav.rel = "shortcut icon";
      doc.head.appendChild(fav);
    }
    fav.href = iconUrl;
    fav.setAttribute("href", iconUrl); // Ensure attribute updates
  };

  const customName = localStorage.getItem("CustomName");
  const customIcon = localStorage.getItem("CustomIcon");
  
  let titleToSet = "Gamo Launchpad";
  let iconToSet = "favicon.png";

  if (selectedValue === "Custom" && customName && customIcon) {
    titleToSet = customName;
    iconToSet = customIcon;
  } else {
    const cloak = cloaks[selectedValue] || cloaks["Google"];
    if (cloak) {
      titleToSet = cloak.title;
      iconToSet = cloak.icon;
    }
  }
  
  // Persist
  localStorage.setItem("name", titleToSet);
  localStorage.setItem("icon", iconToSet);

  // Apply to current document
  setCloak(document, titleToSet, iconToSet);

  // Apply to Top/Parent Frame (crucial for iframe/shell persistence)
  try {
    if (window.top !== window && window.top.document) {
      setCloak(window.top.document, titleToSet, iconToSet);
    }
    if (window.parent !== window && window.parent.document) {
      setCloak(window.parent.document, titleToSet, iconToSet);
    }
  } catch (e) {
    console.warn("Could not set top frame cloak (CORS?)", e);
  }
}
// Custom Background
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-button");
  const backgroundInput = document.getElementById("background-input");
  const resetButton = document.getElementById("reset-button");

  saveButton.addEventListener("click", () => {
    const imageURL = backgroundInput.value;
    if (imageURL.trim() !== "") {
      localStorage.setItem("backgroundImage", imageURL);
      document.body.style.backgroundImage = `url('${imageURL}')`;
      backgroundInput.value = "";
    } else {
      console.log("No image URL entered.");
    }
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("backgroundImage");
    document.body.style.backgroundImage = "url('default-background.jpg')";
    window.location.reload();
  });
});

// Particles
const switches = document.getElementById("2");

if (window.localStorage.getItem("particles") !== "") {
  if (window.localStorage.getItem("particles") === "true") {
    switches.checked = true;
  } else {
    switches.checked = false;
  }
}

switches.addEventListener("change", event => {
  if (event.currentTarget.checked) {
    window.localStorage.setItem("particles", "true");
  } else {
    window.localStorage.setItem("particles", "false");
  }
});
// AB Cloak
function AB() {
  let inFrame;

  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }

  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Window blocked. Please allow popups for this site.");
    } else {
      const doc = popup.document;
      const iframe = doc.createElement("iframe");
      const style = iframe.style;
      const link = doc.createElement("link");

      const name = localStorage.getItem("name") || "My Drive - Google Drive";
      const icon = localStorage.getItem("icon") || "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png";

      doc.title = name;
      link.rel = "icon";
      link.href = icon;

      iframe.src = location.href;
      style.position = "fixed";
      style.top = style.bottom = style.left = style.right = 0;
      style.border = style.outline = "none";
      style.width = style.height = "100%";

      const pLink = localStorage.getItem(encodeURI("pLink")) || getRandomURL();
      location.replace(pLink);

      const script = doc.createElement("script");
      script.textContent = `
        window.onbeforeunload = function (event) {
          const confirmationMessage = 'Leave Site?';
          (event || window.event).returnValue = confirmationMessage;
          return confirmationMessage;
        };
      `;
      doc.head.appendChild(link);
      doc.body.appendChild(iframe);
      doc.head.appendChild(script);
    }
  }
}

function toggleAB() {
  ab = localStorage.getItem("ab");
  if (!ab) {
    localStorage.setItem("ab", "true");
  } else if (ab === "true") {
    localStorage.setItem("ab", "false");
  } else {
    localStorage.setItem("ab", "true");
  }
}
// Search Engine
function EngineChange(dropdown) {
  const selectedEngine = dropdown.value;

  const engineUrls = {
    Google: "https://www.google.com/search?q=",
    Bing: "https://www.bing.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
    Qwant: "https://www.qwant.com/?q=",
    Startpage: "https://www.startpage.com/search?q=",
    SearchEncrypt: "https://www.searchencrypt.com/search/?q=",
    Ecosia: "https://www.ecosia.org/search?q=",
  };

  localStorage.setItem("engine", engineUrls[selectedEngine]);
  localStorage.setItem("enginename", selectedEngine);

  dropdown.value = selectedEngine;
}

function SaveEngine() {
  const customEngine = document.getElementById("engine-form").value;
  if (customEngine.trim() !== "") {
    localStorage.setItem("engine", customEngine);
    localStorage.setItem("enginename", "Custom");
  } else {
    alert("Please enter a custom search engine value.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const selectedEngineName = localStorage.getItem("enginename");
  const dropdown = document.getElementById("engine");
  if (selectedEngineName) {
    dropdown.value = selectedEngineName;
  }
});

function getRandomURL() {
  const randomURLS = [
    "https://kahoot.it",
    "https://classroom.google.com",
    "https://drive.google.com",
    "https://google.com",
    "https://docs.google.com",
    "https://slides.google.com",
    "https://www.nasa.gov",
    "https://blooket.com",
    "https://clever.com",
    "https://edpuzzle.com",
    "https://khanacademy.org",
    "https://wikipedia.org",
    "https://dictionary.com",
  ];
  return randomURLS[randRange(0, randomURLS.length)];
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function exportSaveData() {
  function getCookies() {
    const cookies = document.cookie.split("; ");
    const cookieObj = {};
    cookies.forEach(cookie => {
      const [name, value] = cookie.split("=");
      cookieObj[name] = value;
    });
    return cookieObj;
  }
  function getLocalStorage() {
    const localStorageObj = {};
    for (const key in localStorage) {
      if (Object.hasOwn(localStorage, key)) {
        localStorageObj[key] = localStorage.getItem(key);
      }
    }
    return localStorageObj;
  }
  const data = {
    cookies: getCookies(),
    localStorage: getLocalStorage(),
  };
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "save_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importSaveData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.cookies) {
          Object.entries(data.cookies).forEach(([key, value]) => {
            document.cookie = `${key}=${value}; path=/`;
          });
        }
        if (data.localStorage) {
          Object.entries(data.localStorage).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
        }
        alert("Your save data has been imported. Please test it out.");
        alert("If you find any issues then report it on GitHub.");
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
