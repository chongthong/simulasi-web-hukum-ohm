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
const pDisplay = document.getElementById('p-display');

// Variabel untuk menyimpan komponen yang ditempatkan
let placedComponents = {
  resistor: null,
  led: null
};

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
  const ledBulb = document.querySelector('#slot-led .led-bulb');
  if (ledBulb) {
    ledBulb.style.fill = '#FFFFFF';
    ledBulb.style.filter = 'none';
    ledBulb.style.animation = 'none';
    ledBulb.style.transition = 'none';
  }
}

// Reset tampilan hasil
function resetDisplay() {
  iDisplay.textContent = '0.00';
  pDisplay.textContent = '0.00';
  resetLED();
}

// Fungsi untuk menghitung dan menampilkan hasil (HANYA saat tombol ditekan)
// Fungsi untuk menghitung dan menampilkan hasil (HANYA saat tombol ditekan)
function calculateAndDisplay() {
  console.log('Tombol simulasi ditekan!');
  
  // Validasi: cek apakah sirkuit lengkap
  if (!state.resistor || !state.led) {
    console.log('Sirkuit tidak lengkap! Resistor:', state.resistor, 'LED:', state.led);
   return;
  }

  const V = parseFloat(vInput.value);
  const R = parseFloat(rInput.value);
  
  console.log('Nilai input - V:', V, 'R:', R);
  
  

  // Hitung arus (I = V / R) dalam mA
  const I_mA = (V / R) * 1000;
  
  console.log('Arus yang dihitung:', I_mA, 'mA');
  
  // Update tampilan
  iDisplay.textContent = I_mA.toFixed(2);
  
  // Update warna LED berdasarkan arus
  updateLEDColor(I_mA);
  
  // Tampilkan pesan berdasarkan hasil
  showResultMessage(I_mA);
}

// Update warna LED berdasarkan arus
// Update warna LED berdasarkan arus (VERSI DIPERBAIKI)
function updateLEDColor(I_mA) {
  const ledSlot = document.querySelector('#slot-led');
  if (!ledSlot) return;
  
  const ledBulb = ledSlot.querySelector('.led-bulb');
  if (!ledBulb) return;
  
  let color = "#FFFED6";
  let glowColor = "#FFFED6";
  let glowIntensity = 0;
  let brightness = 0.3;
  
  if (I_mA > 0 && I_mA < 50) {
    color = "#faf9ca"; // Kuning sangat redup
  } else if (I_mA >= 50 && I_mA < 150) {
    color = "#ffeb3b"; // Kuning
  } else if (I_mA >= 150 && I_mA <= 200) {
    color = "#ff9800"; // Oranye terang 
  } else if (I_mA > 200) {
    color = "#000000"; // Oranye merah (terlalu terang) 
  } 
  
  // Debug: Log untuk memastikan fungsi dipanggil
  console.log('updateLEDColor dipanggil dengan I_mA:', I_mA);
  console.log('Warna yang akan diterapkan:', color);
  console.log('Elemen LED ditemukan:', !!ledBulb);
  
  // Terapkan perubahan warna fill
  ledBulb.setAttribute('fill', color);
  
  
}

// Fungsi reset LED yang diperbaiki
function resetLED() {
  const ledSlot = document.querySelector('#slot-led');
  if (!ledSlot) return;
  
  const ledBulb = ledSlot.querySelector('.led-bulb');
  if (ledBulb) {
    ledBulb.setAttribute('fill', '#FFFFFF');
    ledBulb.style.opacity = '1';
    ledBulb.style.filter = 'none';
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

// Fungsi reset LED yang diperbaiki
function resetLED() {
  const ledSlot = document.querySelector('#slot-led');
  if (!ledSlot) return;
  
  const ledBulb = ledSlot.querySelector('.led-bulb');
  if (ledBulb) {
    ledBulb.setAttribute('fill', '#FFFFFF');
    ledBulb.style.opacity = '1';
    ledBulb.style.filter = 'none';
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



// Toast notification
function showToast(message, type) {
  // Hapus toast sebelumnya jika ada
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Buat elemen toast baru
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  // Tambahkan ke body
  document.body.appendChild(toast);
  
  // Tampilkan toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Tambahkan event listener untuk tombol close
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto-hide setelah 5 detik
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Event listener untuk tombol +/-
document.querySelectorAll('.value-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const isPlus = this.classList.contains('plus');
    const step = parseFloat(input.step) || 1;
    const min = parseFloat(input.min) || -Infinity;
    const max = parseFloat(input.max) || Infinity;
    
    let currentValue = parseFloat(input.value) || 0;
    let newValue = isPlus ? currentValue + step : currentValue - step;
    
    // Batasi nilai dalam range
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Update nilai input
    input.value = newValue;
    
    // Sync dengan slider jika ada
    const sliderId = targetId.replace('input', 'slider');
    const slider = document.getElementById(sliderId);
    if (slider) {
      slider.value = newValue;
    }
    
    // Reset tampilan saat nilai diubah (karena simulasi belum dijalankan)
    resetDisplay();
  });
});

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
      
      // Simpan komponen yang ditempatkan
      placedComponents[type] = clone;
      
      // Update status sirkuit
      updateCircuitStatus();
      
      // Reset tampilan karena komponen baru ditambahkan
      resetDisplay();
      
      // Tampilkan pesan sukses
      showToast(`Komponen ${type} berhasil dipasang! Klik "Simulasikan Sirkuit" untuk melihat hasil.`, 'success');
    } 
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
      
      // Simpan komponen yang sudah ada
      placedComponents[type] = zone.querySelector('svg');
    }
  });
  
  updateCircuitStatus();
  
  // Tambahkan style untuk toast dan efek tombol
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: white;
      border-radius: 10px;
      padding: 15px 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 400px;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
      z-index: 1000;
      border-left: 5px solid #00BCD4;
    }
    
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .toast-success {
      border-left-color: #4CAF50;
    }
    
    .toast-error {
      border-left-color: #F44336;
    }
    
    .toast-warning {
      border-left-color: #FFC107;
    }
    
    .toast-info {
      border-left-color: #00BCD4;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }
    
    .toast-content i {
      font-size: 1.5rem;
    }
    
    .toast-success .toast-content i {
      color: #4CAF50;
    }
    
    .toast-error .toast-content i {
      color: #F44336;
    }
    
    .toast-warning .toast-content i {
      color: #FFC107;
    }
    
    .toast-info .toast-content i {
      color: #00BCD4;
    }
    
    .toast-content span {
      color: #333;
      font-size: 0.95rem;
      line-height: 1.4;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: #777;
      cursor: pointer;
      font-size: 1rem;
      padding: 5px;
      margin-left: 10px;
    }
    
    .toast-close:hover {
      color: #333;
    }
    
    /* Animation for blinking LED */
    @keyframes blink {
      from { opacity: 0.7; }
      to { opacity: 1; }
    }
    
    /* Efek tombol saat diklik */
    .simulate-btn.clicked {
      transform: scale(0.98);
      box-shadow: 0 5px 15px rgba(0, 188, 212, 0.4);
    }
  `;
  
  document.head.appendChild(toastStyle);
});