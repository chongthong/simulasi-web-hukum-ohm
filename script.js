// State untuk melacak komponen yang sudah ditempatkan
let state = { 
  resistor: false, 
  led: false,
  battery: true // Baterai sudah terpasang tetap
};

// Elemen DOM utama
const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const btnGenerate = document.getElementById('btn-generate');
const circuitStatus = document.getElementById('circuit-status');
const statusDot = circuitStatus.querySelector('.status-dot');
const statusText = circuitStatus.querySelector('.status-text');

// Elemen input dan slider
const vInput = document.getElementById('v-input');
const rInput = document.getElementById('r-input');
const vSlider = document.getElementById('v-slider');
const rSlider = document.getElementById('r-slider');

// Elemen display
const iDisplay = document.getElementById('i-display');

// Update status sirkuit
function updateCircuitStatus() {
  const componentsNeeded = Object.keys(state).filter(key => key !== 'battery' && !state[key]);
  
  if (componentsNeeded.length === 0) {
    statusDot.style.background = '#4CAF50';
    statusText.textContent = 'Sirkuit Siap!';
    statusText.style.color = '#2E7D32';
    circuitStatus.style.background = '#E8F5E9';
    circuitStatus.style.borderColor = '#C8E6C9';
    statusDot.style.animation = 'none';
  } else {
    statusDot.style.background = '#F44336';
    statusText.textContent = 'Sirkuit Tidak Lengkap';
    statusText.style.color = '#D32F2F';
    circuitStatus.style.background = '#FFEBEE';
    circuitStatus.style.borderColor = '#FFCDD2';
    statusDot.style.animation = 'pulse 2s infinite';
  }
}

// Reset LED ke kondisi awal
function resetLED() {
  const ledSlot = document.querySelector('#slot-led');
  if (!ledSlot) return;
  
  const ledBulb = ledSlot.querySelector('.led-bulb');
  if (ledBulb) {
    ledBulb.setAttribute('fill', '#FFFFFF');
    ledBulb.style.opacity = '1';
    ledBulb.style.animation = 'none';
    ledBulb.style.transition = 'none';
    
    // Hapus filter SVG jika ada
    const svgElement = ledSlot.querySelector('svg');
    if (svgElement) {
      const defs = svgElement.querySelector('defs');
      if (defs) {
        const filter = defs.querySelector('filter');
        if (filter) filter.remove();
      }
      ledBulb.removeAttribute('filter');
    }
  }
}

// Reset tampilan hasil
function resetDisplay() {
  iDisplay.textContent = '0.00';
  resetLED();
}

// Update warna LED berdasarkan arus
function updateLEDColor(I_mA) {
  const ledSlot = document.querySelector('#slot-led');
  if (!ledSlot) return;
  
  const ledBulb = ledSlot.querySelector('.led-bulb');
  if (!ledBulb) return;
  
  let color = "#ffffff";
  
  if (I_mA > 0 && I_mA < 50) {
    color = "#fffc5f"; // Kuning sangat redup
       
  } else if (I_mA >= 50 && I_mA < 150) {
    color = "#fc9653"; // Kuning
      } else if (I_mA >= 150 && I_mA <= 200) {
    color = "#ff3c01"; // Oranye terang
      } else if (I_mA > 200) {
    color = "#000000"; // Oranye merah (terlalu terang)
   
    
  } 
  
  // Terapkan perubahan warna fill
  ledBulb.setAttribute('fill', color);
  
  // Buat filter untuk glow effect
  const filterId = `glow-${Date.now()}`;
  
  // Hapus filter lama jika ada
  const oldFilter = document.getElementById('led-glow-filter');
  if (oldFilter) oldFilter.remove();
  
  // Buat filter SVG baru untuk glow effect
  const svgNS = "http://www.w3.org/2000/svg";
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", filterId);
  filter.setAttribute("x", "-50%");
  filter.setAttribute("y", "-50%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");
  
  const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussianBlur.setAttribute("stdDeviation", glowIntensity.toString());
  feGaussianBlur.setAttribute("result", "coloredBlur");
  
  const feMerge = document.createElementNS(svgNS, "feMerge");
  const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode1.setAttribute("in", "coloredBlur");
  const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode2.setAttribute("in", "SourceGraphic");
  
  feMerge.appendChild(feMergeNode1);
  feMerge.appendChild(feMergeNode2);
  
  filter.appendChild(feGaussianBlur);
  filter.appendChild(feMerge);
  
  // Tambahkan filter ke SVG
  const svgElement = ledSlot.querySelector('svg');
  if (svgElement) {
    // Cek apakah sudah ada defs, jika tidak buat
    let defs = svgElement.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(svgNS, "defs");
      svgElement.insertBefore(defs, svgElement.firstChild);
    }
    defs.appendChild(filter);
    
    // Terapkan filter ke LED bulb
    ledBulb.setAttribute('filter', `url(#${filterId})`);
  }
  
  // Terapkan opacity untuk brightness
  ledBulb.style.opacity = brightness.toString();
  ledBulb.style.transition = "fill 0.5s ease, opacity 0.5s ease";
}

// Fungsi untuk menghitung dan menampilkan hasil (HANYA saat tombol ditekan)
function calculateAndDisplay() {
  // Validasi: cek apakah sirkuit lengkap
  if (!state.resistor || !state.led) {
    // Tidak ada notifikasi
    return;
  }

  const V = parseFloat(vInput.value);
  const R = parseFloat(rInput.value);
  
  // Validasi input
  if (isNaN(V) || V <= 0) {
    // Tidak ada notifikasi
    return;
  }
  
  if (isNaN(R) || R <= 0) {
    // Tidak ada notifikasi
    return;
  }

  // Hitung arus (I = V / R) dalam mA
  const I_mA = (V / R) * 1000;
  
  // Update tampilan
  iDisplay.textContent = I_mA.toFixed(2);
  
  // Update warna LED berdasarkan arus
  updateLEDColor(I_mA);
  
  // Tidak menampilkan pesan hasil (toast dihapus)
}

// Event listener untuk input number
[vInput, rInput].forEach(input => {
  input.addEventListener('input', function() {
    const value = parseFloat(this.value);
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);
    
    // Validasi range
    if (value < min) this.value = min;
    if (value > max) this.value = max;
    
    // Sync dengan slider
    const sliderId = this.id.replace('input', 'slider');
    const slider = document.getElementById(sliderId);
    if (slider) {
      slider.value = this.value;
    }
    
    // Reset tampilan saat nilai diubah (karena simulasi belum dijalankan)
    resetDisplay();
  });
});

// Event listener untuk slider
[vSlider, rSlider].forEach(slider => {
  slider.addEventListener('input', function() {
    const inputId = this.id.replace('slider', 'input');
    const input = document.getElementById(inputId);
    if (input) {
      input.value = this.value;
      
      // Reset tampilan saat nilai diubah (karena simulasi belum dijalankan)
      resetDisplay();
    }
  });
});

// Drag & Drop functionality
draggables.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', item.dataset.type);
    e.dataTransfer.setData('sourceId', item.id);
    item.style.opacity = '0.4';
  });
  
  item.addEventListener('dragend', (e) => {
    item.style.opacity = '1';
  });
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = '#00BCD4';
    zone.style.transform = 'scale(1.05)';
  });
  
  zone.addEventListener('dragleave', (e) => {
    zone.style.borderColor = '#bbb';
    zone.style.transform = 'scale(1)';
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = '#bbb';
    zone.style.transform = 'scale(1)';
    
    const type = e.dataTransfer.getData('type');
    const sourceId = e.dataTransfer.getData('sourceId');
    const expectedType = zone.dataset.type;

    if (type === expectedType) {
      const sourceElement = document.getElementById(sourceId);
      const clone = sourceElement.querySelector('svg').cloneNode(true);
      
      // Kosongkan dan tambahkan komponen
      zone.innerHTML = "";
      zone.appendChild(clone);
      zone.classList.add('filled');
      
      // Update state
      state[type] = true;
      
      // Update status sirkuit
      updateCircuitStatus();
      
      // Reset tampilan karena komponen baru ditambahkan
      resetDisplay();
      
      // Tidak menampilkan toast sukses
    } 
    // Tidak menampilkan toast error
  });
});

// Event listener untuk tombol generate/simulate (HANYA di sini perhitungan dilakukan)
btnGenerate.addEventListener('click', () => {
  // Tambahkan efek visual pada tombol
  btnGenerate.classList.add('clicked');
  setTimeout(() => {
    btnGenerate.classList.remove('clicked');
  }, 300);
  
  // Jalankan perhitungan
  calculateAndDisplay();
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  // Reset tampilan awal
  resetDisplay();
  
  // Cek jika komponen sudah ada di drop zone (untuk reload halaman)
  dropZones.forEach(zone => {
    if (zone.querySelector('svg')) {
      const type = zone.dataset.type;
      state[type] = true;
    }
  });
  
  updateCircuitStatus();
});