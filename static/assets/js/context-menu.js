document.addEventListener("DOMContentLoaded", () => {
    // Inject HTML for Menu
    const menuHTML = `
    <div id="gamo-context-menu" class="glass-panel" style="display: none; position: fixed; z-index: 9999; padding: 0.5rem; min-width: 150px; flex-direction: column; gap: 0.2rem;">
        <div class="ctx-item" onclick="history.back()"><i class="fa-solid fa-arrow-left"></i> Back</div>
        <div class="ctx-item" onclick="location.reload()"><i class="fa-solid fa-rotate-right"></i> Reload</div>
        <div class="ctx-item" onclick="history.forward()"><i class="fa-solid fa-arrow-right"></i> Forward</div>
        <div class="ctx-divider" style="height: 1px; background: rgba(255,255,255,0.1); margin: 0.2rem 0;"></div>
        <div class="ctx-item" onclick="window.location.href='/settings.html'"><i class="fa-solid fa-gear"></i> Settings</div>
    </div>
    <style>
        .ctx-item {
            padding: 0.5rem 1rem;
            color: white;
            cursor: pointer;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        .ctx-item:hover {
            background: rgba(255,255,255,0.1);
        }
    </style>
    `;
    
    const div = document.createElement("div");
    div.innerHTML = menuHTML;
    document.body.appendChild(div);

    const menu = document.getElementById("gamo-context-menu");

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        menu.style.display = "flex";
        
        // Positioning logic to keep in bounds
        let x = e.clientX;
        let y = e.clientY;
        
        if (x + 160 > window.innerWidth) x -= 160;
        if (y + 150 > window.innerHeight) y -= 150;

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
    });

    document.addEventListener("click", () => {
        menu.style.display = "none";
    });
});
