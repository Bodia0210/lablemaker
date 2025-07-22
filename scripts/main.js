const logoMap = {
  "TACO": "svg/taco.svg",
  "Modine": "svg/modine.svg",
  "SpiraxSarco": "svg/spiraxsarco.svg",
  "DriSteem": "svg/dristeem.svg",
  "AQC": "svg/aqc.svg",
  "Daikin": "svg/daikin.svg",
  "IEC": "svg/iec.svg",
  "Nova Flex": "svg/novaflex.svg",
  "Oxygen 8": "svg/oxygen8.svg",
  "Pool Pac": "svg/poolpak.svg",
  "Senior Flexonics": "svg/seniorflexonics.svg"
};



window.addEventListener("DOMContentLoaded", function () {
  const companySelect = document.getElementById("companySelect");
  const logoImg = document.getElementById("company-logo");

  const updateLogo = () => {
    const selected = companySelect.value;
    logoImg.src = logoMap[selected] || "";
    logoImg.alt = selected + " Logo";
  };

  companySelect.addEventListener("change", updateLogo);
  updateLogo(); // Показати одразу при завантаженні

  // Встановити дату й час
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatted = `${pad(now.getHours())}${pad(now.getMinutes())}${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  document.getElementById("delivery-time-date").value = formatted;
});

const totalPiecesInput = document.getElementById('total-pieces');
const dimensionsContainer = document.getElementById('dimensionsContainer');

totalPiecesInput.addEventListener('input', () => {
  const count = parseInt(totalPiecesInput.value);

  // Очистити попередні поля
  dimensionsContainer.innerHTML = '';

  if (!isNaN(count) && count > 0) {
    for (let i = 1; i <= count; i++) {
      const label = document.createElement('label');
      label.textContent = `Dimensions ${i}:`;

      const input = document.createElement('input');
      input.type = 'text';
      input.name = `dimension${i}`;
      input.placeholder = `Enter dimensions for piece ${i}`;
      input.className = 'short'; // або будь-який інший клас, який ти використовуєш

      const wrapper = document.createElement('div');
      wrapper.className = 'field'; // це щоб стиль зберігся

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      dimensionsContainer.appendChild(wrapper);
    }
  }
});
