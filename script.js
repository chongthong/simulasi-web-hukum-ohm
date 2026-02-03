const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const controls = document.getElementById('controls');
const resultText = document.getElementById('result-text');
const btnGenerate = document.getElementById('btn-generate');

let state = { led: false, resistor: false, battery: false };

// Drag and Drop Logic
draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('sourceId', item.id);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('dragover', () => zone.classList.add('hover'));
    zone.addEventListener('dragleave', () => zone.classList.remove('hover'));

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hover');
        
        const type = e.dataTransfer.getData('type');
        const sourceId = e.dataTransfer.getData('sourceId');

        if (type === zone.dataset.type) {
            const clone = document.getElementById(sourceId).querySelector('svg').cloneNode(true);
            zone.innerHTML = "";
            zone.appendChild(clone);
            zone.classList.add('filled');
            state[type] = true;
            checkCircuit();
        } else {
            alert("Oops! Komponen tidak sesuai slot.");
        }
    });
});

function checkCircuit() {
    if (state.led && state.resistor && state.battery) {
        controls.classList.remove('hidden');
        resultText.innerText = "Sirkuit Siap! Klik Generate.";
    }
}

// Ohm's Law Calculation
btnGenerate.addEventListener('click', () => {
    const V = parseFloat(document.getElementById('v-val').value);
    const R = parseFloat(document.getElementById('r-val').value);
    
    if (!V || !R || R <= 0) {
        alert("Masukkan nilai V dan R (R > 0)");
        return;
    }

    const I_mA = (V / R) * 1000;
    const ledIcon = document.querySelector('#slot-led svg #led-bulb-icon');
    
    let color = "#ecf0f1"; // Default off
    let msg = "";

    if (I_mA < 50) {
        color = "#bdc3c7"; msg = "Arus terlalu rendah (LED Mati)";
    } else if (I_mA < 150) {
        color = "#f1c40f"; msg = "Arus Sedang (LED Redup)";
    } else if (I_mA <= 200) {
        color = "#f39c12"; msg = "Arus Sesuai (LED Terang)";
    } else {
        color = "#c0392b"; msg = "OVER CURRENT! LED Terbakar";
    }

    // Animasi perubahan warna LED
    ledIcon.style.fill = color;
    ledIcon.style.transition = "fill 0.5s ease";
    
    resultText.innerHTML = `Arus: <span style="color:${color}">${I_mA.toFixed(2)} mA</span><br>${msg}`;
});