const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const btnGenerate = document.getElementById('btn-generate');
const modal = document.getElementById('modal');

let state = { resistor: false, led: false };

// Drag & Drop
draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('sourceId', item.id);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
        const type = e.dataTransfer.getData('type');
        const sourceId = e.dataTransfer.getData('sourceId');

        if (type === zone.dataset.type) {
            const clone = document.getElementById(sourceId).querySelector('svg').cloneNode(true);
            zone.innerHTML = "";
            zone.appendChild(clone);
            zone.classList.add('filled');
            state[type] = true;
        } else {
            alert("Gunakan slot yang benar!");
        }
    });
});

// Hitung Hukum Ohm
// Bagian dalam event listener btn-generate yang sudah diperbarui:
btnGenerate.addEventListener('click', () => {
   if (!state.resistor || !state.led) {
        alert("Lengkapi komponen sirkuit!");
        return;
    }

    const V = parseFloat(document.getElementById('v-input').value);
    const R = parseFloat(document.getElementById('r-input').value);
    
    if (isNaN(V) || isNaN(R) || R <= 0) return;

    const I_mA = (V / R) * 1000;
    
    // Baris ini dihapus/dikomentari karena id="r-display" sudah tidak ada
    // document.getElementById('r-display').textContent = R; 

    // Update tampilan Arus tetap jalan
    document.getElementById('i-display').textContent = I_mA.toFixed(2);

    // Update Warna LED tetap jalan
    const ledBulb = document.querySelector('#slot-led .led-bulb');
    let color = "#eee";

    if (I_mA > 50 && I_mA < 150) {
        color = "#ffeb3b"; // Kuning Redup
    } else if (I_mA >= 150 && I_mA <= 200) {
        color = "#ff9800"; // Oranye Terang
    } else if (I_mA > 200) {
        color = "#f44336"; // Merah Terbakar
    }

    if (ledBulb) {
        ledBulb.style.fill = color;
        // Efek glow agar lebih realistis
        ledBulb.style.filter = I_mA > 10 ? `drop-shadow(0 0 15px ${color})` : "none";
        ledBulb.style.transition = "fill 0.3s ease, filter 0.3s ease";
    }
    
    // Logika modal sudah dihapus dari sini
});

document.getElementById('btn-close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});