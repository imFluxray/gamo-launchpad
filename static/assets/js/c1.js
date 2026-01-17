// cloak.js
let appInd = 0;
const g = window.location.pathname === "/a";
const a = window.location.pathname === "/b";
const c = window.location.pathname === "/gt";

let t;
try {
  t = window.top.location.pathname === "/d";
} catch {
  t = false;
}

// Global state for lazy loading
let allApps = [];
let displayedCount = 0;
const CHUNK_SIZE = 24;
let activeCategory = 'all';
let activeSearch = '';

function Span(name) {
  return name.split("").map(char => {
    const span = document.createElement("span");
    span.textContent = char;
    return span;
  });
}

function saveToLocal(path) {
  sessionStorage.setItem("GoUrl", path);
}

function handleClick(app) {
  if (typeof app.say !== "undefined") {
    alert(app.say);
  }

  let Selected = app.link;
  if (app.links && app.links.length > 1) {
    Selected = getSelected(app.links);
    if (!Selected) return false;
  }

  if (app.local) {
    saveToLocal(Selected);
    window.location.href = "rx";
    if (t) window.location.href = Selected;
  } else if (app.local2) {
    saveToLocal(Selected);
    window.location.href = Selected;
  } else if (app.blank) {
    blank(Selected);
  } else if (app.now) {
    now(Selected);
    if (t) window.location.href = Selected;
  } else if (app.custom) {
    Custom(app);
  } else if (app.dy) {
    dy(Selected);
  } else {
    go(Selected);
    if (t) blank(Selected);
  }
  return false;
}

function getSelected(links) {
  const options = links.map((link, index) => `${index + 1}: ${link.name}`).join("\n");
  const choice = prompt(`Select a link by entering the corresponding number:\n${options}`);
  const selectedIndex = Number.parseInt(choice, 10) - 1;

  if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= links.length) {
    alert("Invalid selection. Please try again.");
    return null;
  }
  return links[selectedIndex].url;
}

function createAppCard(app, index, isPinned = false) {
  const columnDiv = document.createElement("div");
  columnDiv.classList.add("column");
  columnDiv.classList.add("game-card");
  columnDiv.setAttribute("data-category", app.categories.join(" "));

  const link = document.createElement("a");
  link.className = "game-card-link";
  link.onclick = (e) => {
      e.preventDefault();
      handleClick(app);
  };

  const image = document.createElement("img");
  image.className = "game-card-image";
  image.loading = "lazy";
  image.alt = app.name;
  
  if (app.image) {
    image.src = app.image;
  } else {
    image.style.display = "none";
  }

  const title = document.createElement("span");
  title.className = "game-card-title";
  title.textContent = app.name;

  if (app.error) title.classList.add("error");
  else if (app.load || app.partial) title.classList.add("warning");

  link.appendChild(image);
  link.appendChild(title);
  columnDiv.appendChild(link);

  return columnDiv;
}

function renderChunk() {
  const nonPinnedApps = document.querySelector(".apps");
  const fragment = document.createDocumentFragment();
  
  let count = 0;
  let i = displayedCount; // Start from where we left off global list
  
  // Filter Logic embedded in render loop for performance
  const filteredApps = allApps.filter(app => {
      // Category Filter
      if (activeCategory !== 'all' && !app.categories.includes(activeCategory)) return false;
      // Search Filter
      if (activeSearch && !app.name.toLowerCase().includes(activeSearch)) return false;
      
      // Explicitly remove unwanted "apps"
      if (app.name.includes("Request An App") || app.name.includes("Create Custom App") || app.name.startsWith("!")) return false;
      
      return true;
  });

  // Decide what to render based on filtered list
  // We need to track actual rendered index relative to filtered list
  const chunkToRender = filteredApps.slice(displayedCount, displayedCount + CHUNK_SIZE);
  
  chunkToRender.forEach(app => {
      const card = createAppCard(app, app.originalIndex); // originalIndex for pinning
      fragment.appendChild(card);
  });

  nonPinnedApps.appendChild(fragment);
  displayedCount += chunkToRender.length;
}

// Detect scroll to bottom
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        renderChunk();
    }
});

function category() {
  activeCategory = document.getElementById("category").value;
  resetRender();
}

function bar() {
  activeSearch = document.getElementById("search").value.toLowerCase();
  resetRender();
}

function resetRender() {
    document.querySelector(".apps").innerHTML = '';
    displayedCount = 0; // Reset count
    renderChunk(); // Render first chunk
}

// ... Pinning Logic and Setup ...
function setPin(index) {
  let pins = getPins();
  if (pins.includes(index)) {
    pins = pins.filter(p => p !== index);
  } else {
    pins.push(index);
  }
  savePins(pins);
  location.reload(); 
}

function getPins() {
    let key = g ? "Gpinned" : (c ? "Tpinned" : "Apinned");
    let pins = localStorage.getItem(key);
    return pins ? pins.split(",").map(Number) : [];
}

function savePins(pins) {
    let key = g ? "Gpinned" : (c ? "Tpinned" : "Apinned");
    localStorage.setItem(key, pins.join(","));
}


document.addEventListener("DOMContentLoaded", () => {
  let path = "/assets/json/a.min.json";
  if (g) path = "/assets/json/g.min.json";
  else if (c) path = "/assets/json/t.min.json";

  fetch(path)
    .then(res => res.json())
    .then(appsList => {
      // Sort
      appsList.sort((a, b) => {
        if (a.name.startsWith("[Custom]")) return -1;
        if (b.name.startsWith("[Custom]")) return 1;
        return a.name.localeCompare(b.name);
      });

      // Store Original Index for Pinning
      allApps = appsList.map((app, index) => ({...app, originalIndex: index}));
      
      // Render Pinned (Always render all pinned)
      const pins = getPins();
      const pinnedContainer = document.querySelector(".pinned");
      
      allApps.forEach(app => {
          if (pins.includes(app.originalIndex)) {
              const card = createAppCard(app, app.originalIndex, true);
              pinnedContainer.appendChild(card);
          }
      });

      // Initial Render
      resetRender();
    });
});
