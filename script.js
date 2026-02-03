const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');

let state = { resistor: false, led: false };

// Drag and Drop
draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('id', item.id);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
        const type = e.dataTransfer.getData('type');
        if (type === zone.dataset.type) {
            const clone = document.getElementById(e.dataTransfer.getData('id')).querySelector('svg').cloneNode(true);
            zone.innerHTML = "";
            zone.appendChild(clone);
            zone.classList.add('filled');
            state[type] = true;
        }
    });
});

// Calculate Current
document.getElementById('btn-generate').addEventListener('click', () => {
    if (!state.resistor || !state.led) {
        alert("Please complete the circuit first!");
        return;
    }

    const V = parseFloat(document.getElementById('v-input').value);
    const R = parseFloat(document.getElementById('r-input').value);
    
    if (isNaN(V) || isNaN(R) || R <= 0) return;

    const I_mA = (V / R) * 1000;
    
    // Update Labels
    document.getElementById('r-val-label').innerText = R;
    document.getElementById('i-val-label').innerText = I_mA.toFixed(2);

    // Update LED Visual
    const ledBulb = document.querySelector('#slot-led .led-bulb');
    let color = "#eee";
    if (I_mA > 10 && I_mA < 150) color = "#ffeb3b";
    else if (I_mA >= 150 && I_mA <= 220) color = "#ff9800";
    else if (I_mA > 220) color = "#f44336";

    ledBulb.style.fill = color;
    
    // Show Popup
    document.getElementById('modal').style.display = 'block';
});

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}