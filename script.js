const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const btnGenerate = document.getElementById('btn-generate');
const statusDisplay = document.getElementById('status-display');
const inputArea = document.getElementById('input-area');

let placedComponents = { led: false, resistor: false, battery: false };

// --- LOGIKA DRAG & DROP ---
draggables.forEach(drag => {
    drag.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', drag.id);
        e.dataTransfer.setData('type', drag.dataset.type);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('hover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hover');
        
        const id = e.dataTransfer.getData('text/plain');
        const type = e.dataTransfer.getData('type');
        const targetType = zone.dataset.type;

        if (type === targetType) {
            const icon = document.getElementById(id).innerText.split('\n')[0];
            zone.innerHTML = icon;
            zone.classList.add('filled');
            placedComponents[type] = true;
            checkAllPlaced();
        } else {
            alert("Komponen tidak cocok dengan slot ini!");
        }
    });
});

function checkAllPlaced() {
    if (placedComponents.led && placedComponents.resistor && placedComponents.battery) {
        inputArea.style.display = 'flex';
        statusDisplay.innerText = "Sirkuit Lengkap! Masukkan nilai V dan R.";
    }
}

// --- LOGIKA KALKULASI ---
btnGenerate.addEventListener('click', () => {
    if (!placedComponents.led || !placedComponents.resistor || !placedComponents.battery) {
        alert("Lengkapi sirkuit dulu!");
        return;
    }

    const V = parseFloat(document.getElementById('voltage').value);
    const R = parseFloat(document.getElementById('resistance').value);
    const ledSlot = document.getElementById('slot-led');

    if (isNaN(V) || isNaN(R) || R <= 0) {
        alert("Input tidak valid!");
        return;
    }

    const I_mA = (V / R) * 1000;
    let color = "#fff";
    let message = "";

    if (I_mA < 50) {
        color = "#ccc"; message = "Low Current (LED Redup)";
    } else if (I_mA < 150) {
        color = "#ffeb3b"; message = "Medium Current";
    } else if (I_mA <= 200) {
        color = "#ff9800"; message = "High Current (Ideal!)";
    } else {
        color = "#f44336"; message = "OVER CURRENT - LED BURNOUT!";
    }

    ledSlot.style.background = color;
    statusDisplay.innerHTML = `Arus: <b>${I_mA.toFixed(2)} mA</b><br>${message}`;
});