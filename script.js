const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const btnRun = document.getElementById('btn-run');
const msgBox = document.getElementById('msg');

let sirkuitLengkap = { resistor: false, led: false };

// --- LOGIKA DRAG & DROP ---
draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('sourceId', item.id);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hover');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('hover'));

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hover');
        
        const type = e.dataTransfer.getData('type');
        const sourceId = e.dataTransfer.getData('sourceId');

        if (type === zone.dataset.type) {
            const originalIcon = document.getElementById(sourceId).querySelector('svg');
            const clone = originalIcon.cloneNode(true);
            
            zone.innerHTML = "";
            zone.appendChild(clone);
            zone.classList.add('filled');
            sirkuitLengkap[type] = true;
            
            updateMessage();
        } else {
            alert("Gunakan slot yang benar!");
        }
    });
});

function updateMessage() {
    if (sirkuitLengkap.resistor && sirkuitLengkap.led) {
        msgBox.innerText = "Sirkuit Siap! Klik Jalankan Arus.";
        msgBox.style.background = "#2ecc71";
    }
}

// --- LOGIKA HUKUM OHM ---
btnRun.addEventListener('click', () => {
    if (!sirkuitLengkap.resistor || !sirkuitLengkap.led) {
        alert("Pasang semua komponen dulu!");
        return;
    }

    const V = parseFloat(document.getElementById('v-input').value);
    const R = parseFloat(document.getElementById('r-input').value);
    const I_mA = (V / R) * 1000;

    // Cari elemen lampu LED di dalam slot
    const ledBulb = document.querySelector('#slot-led .led-bulb');
    
    let warna = "#95a5a6"; // Mati
    let keterangan = "";

    if (I_mA < 50) {
        warna = "#7f8c8d"; keterangan = "Arus Lemah: LED Mati";
    } else if (I_mA < 150) {
        warna = "#f1c40f"; keterangan = "Arus Ok: LED Redup";
    } else if (I_mA <= 220) {
        warna = "#f39c12"; keterangan = "Arus Ideal: LED Terang";
    } else {
        warna = "#e74c3c"; keterangan = "BURNOUT! LED Putus";
    }

    // Efek Cahaya LED
    ledBulb.style.fill = warna;
    ledBulb.style.filter = I_mA > 50 ? `drop-shadow(0 0 10px ${warna})` : "none";
    ledBulb.style.transition = "0.5s";

    msgBox.innerHTML = `I = ${I_mA.toFixed(1)} mA <br> ${keterangan}`;
});