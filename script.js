// 1. State & Global Variables
let state = { resistor: false, led: false, battery: true };
let touchType = null;
let touchSourceId = null;

const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const btnGenerate = document.getElementById('btn-generate');
const vInput = document.getElementById('v-input');
const rInput = document.getElementById('r-input');
const iDisplay = document.getElementById('i-display');

// 2. Fungsi Utama Penempatan (Desktop & Mobile)
function handlePlacement(zone, type, sourceId) {
  if (type === zone.dataset.type && !zone.classList.contains('filled')) {
    const sourceElement = document.getElementById(sourceId);
    const clone = sourceElement.querySelector('svg').cloneNode(true);
    
    zone.innerHTML = "";
    zone.appendChild(clone);
    zone.classList.add('filled');
    
    state[type] = true;
    updateCircuitStatus();
    resetDisplay();
    
    // Beri getaran singkat jika HP mendukung
    if (window.navigator.vibrate) window.navigator.vibrate(30);
    return true;
  }
  return false;
}

// 3. Event Listeners: Desktop (Mouse)
draggables.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', item.dataset.type);
    e.dataTransfer.setData('sourceId', item.id);
    item.style.opacity = '0.4';
  });
  item.addEventListener('dragend', () => item.style.opacity = '1');
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', (e) => e.preventDefault());
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const sourceId = e.dataTransfer.getData('sourceId');
    handlePlacement(zone, type, sourceId);
  });
});

// 4. TOUCH SUPPORT (MOBILE) - Versi Akurasi Tinggi
draggables.forEach(item => {
  item.addEventListener('touchstart', (e) => {
    touchType = item.dataset.type;
    touchSourceId = item.id;
    item.style.opacity = '0.4';
  }, { passive: true });

  item.addEventListener('touchend', (e) => {
    item.style.opacity = '1';
    
    // Ambil koordinat jari terakhir
    const touch = e.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    // Cek satu per satu drop zone apakah jari kita lepas di dalamnya
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      
      // Deteksi tabrakan koordinat (Collision Detection)
      if (
        touchX >= rect.left &&
        touchX <= rect.right &&
        touchY >= rect.top &&
        touchY <= rect.bottom
      ) {
        handlePlacement(zone, touchType, touchSourceId);
      }
    });

    touchType = null;
    touchSourceId = null;
  });
});

// Mencegah scroll layar saat narik komponen
document.addEventListener('touchmove', (e) => {
  if (touchType) e.preventDefault();
}, { passive: false });

// 5. Logika Simulasi & UI (Tetap Sama)
function updateCircuitStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  const circuitStatus = document.getElementById('circuit-status');
  const isComplete = state.resistor && state.led;
  
  statusDot.style.background = isComplete ? '#4CAF50' : '#F44336';
  statusText.textContent = isComplete ? 'Sirkuit Siap!' : 'Sirkuit Tidak Lengkap';
  statusText.style.color = isComplete ? '#2E7D32' : '#D32F2F';
  circuitStatus.style.background = isComplete ? '#E8F5E9' : '#FFEBEE';
}

function calculateAndDisplay() {
  if (!state.resistor || !state.led) return;
  const V = parseFloat(vInput.value);
  const R = parseFloat(rInput.value);
  if (isNaN(V) || isNaN(R)) return;

  const I_mA = (V / R) * 1000;
  iDisplay.textContent = I_mA.toFixed(2);
  updateLEDColor(I_mA);
}

function updateLEDColor(I_mA) {
  const ledBulb = document.querySelector('.led-bulb');
  if (!ledBulb) return;
  let color = "#ffffff";
  if (I_mA > 0 && I_mA < 50) color = "#fffc5f";
  else if (I_mA >= 50 && I_mA < 150) color = "#fc9653";
  else if (I_mA >= 150 && I_mA <= 200) color = "#ff3c01";
  else if (I_mA > 200) { color = "#000000"; ledBulb.style.animation = 'blink 0.5s infinite'; }
  ledBulb.setAttribute('fill', color);
}

function resetDisplay() {
  iDisplay.textContent = '0.00';
  const ledBulb = document.querySelector('.led-bulb');
  if (ledBulb) { ledBulb.setAttribute('fill', '#FFFFFF'); ledBulb.style.animation = 'none'; }
}

[vInput, rInput].forEach(input => {
  input.addEventListener('input', resetDisplay);
});

btnGenerate.addEventListener('click', calculateAndDisplay);

document.addEventListener('DOMContentLoaded', updateCircuitStatus);