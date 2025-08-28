// ------- Логотипи постачальників -------
const logoMap = {
  "TACO": "svg/taco.svg",
  "TASK": "svg/taskcontrols.png",
  "Modine": "svg/modine.svg",
  "SpiraxSarco": "svg/spiraxsarco.svg",
  "driSteem": "svg/dristeem.svg",
  "AQC": "svg/aqc.svg",
  "Daikin": "svg/daikin.svg",
  "Direct Coil": "svg/directcoil.jpg",
  "Ecogreen": "svg/ecogreen.svg",
  "HVAC Solution": "svg/hvac.svg",
  "IEC": "svg/iec.svg",
  "Mafna": "svg/mafna.svg",
  "Nova Flex": "svg/novaflex.svg",
  "Oxygen 8": "svg/oxygen8.svg",
  "PB": "svg/pb.svg",
  "Pool Pac": "svg/poolpak.svg",
  "RGF": "svg/rgf.svg",
  "Senior Flexonics": "svg/seniorflexonics.svg",
  "ClimateCraft": "svg/climacraft.svg",
  "WEG": "svg/weg.svg",
  "ClimaCool": "svg/climacool.svg"
};

window.addEventListener("DOMContentLoaded", () => {
  // --- логотип постачальника ---
  const companySelect = document.getElementById("companySelect");
  const logoImg = document.getElementById("company-logo");
  const updateLogo = () => {
    const key = companySelect?.value || "";
    logoImg.src = logoMap[key] || "";
    logoImg.alt = key ? `${key} Logo` : "Company Logo";
  };
  companySelect?.addEventListener("change", updateLogo);
  updateLogo();

  // --- дата/час ---
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");
  const formatted = `${pad(now.getHours())}${pad(now.getMinutes())} ${pad(now.getMonth()+1)}/${pad(now.getDate())}/${now.getFullYear()}`;
  const dt = document.getElementById("delivery-time-date");
  if (dt) dt.value = formatted;

  // --- автогенерація Dimensions за Quantity ---
  const totalPiecesInput = document.getElementById("total-pieces");
  const dimensionsContainer = document.getElementById("dimensionsContainer");
  totalPiecesInput?.addEventListener("input", () => {
    const count = parseInt(totalPiecesInput.value, 10);
    dimensionsContainer.innerHTML = "";
    if (!isNaN(count) && count > 0) {
      for (let i = 1; i <= count; i++) {
        const wrap = document.createElement("div");
        wrap.className = "field";
        const input = document.createElement("input");
        input.type = "text";
        input.name = `dimension${i}`;
        input.placeholder = `WxLxH ${i}`;
        input.className = "short";
        wrap.appendChild(input);
        dimensionsContainer.appendChild(wrap);
      }
    }
  });

  // --- Project Name -> друкований блок із переносом ---
  (function () {
    const src = document.getElementById('project-name');
    const out = document.getElementById('project-name-print');
    if (!src || !out) return;
    const sync = () => { out.textContent = src.value || src.placeholder || ''; };
    src.addEventListener('input', sync);
    window.addEventListener('beforeprint', sync);
    sync();
  })();

  // --- Package Type -> друк без «галочки» ---
  (function () {
    const sel = document.getElementById('package-type');
    const out = document.getElementById('package-type-print');
    if (!sel || !out) return;
    const text = () => sel.options[sel.selectedIndex]?.text || '';
    const sync = () => { out.textContent = text(); };
    sel.addEventListener('change', sync);
    window.addEventListener('beforeprint', sync);
    sync();
  })();

  // --- Location -> друк без «галочки» ---
  (function () {
    const sel = document.getElementById('location');
    const out = document.getElementById('location-print');
    if (!sel || !out) return;
    const text = () => sel.options[sel.selectedIndex]?.text || '';
    const sync = () => { out.textContent = text(); };
    sel.addEventListener('change', sync);
    window.addEventListener('beforeprint', sync);
    sync();
  })();

  // --- кнопка друку ---
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
});
window.addEventListener("DOMContentLoaded", () => {
  // ... залишаємо твій існуючий код як є

  // 🔁 Додаємо print-версію для всіх input[type="text"]
  const updatePrintFields = () => {
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
      // Пропускаємо, якщо вже є print-клон
      if (input.nextElementSibling?.classList?.contains('only-print')) return;

      const div = document.createElement("div");
      div.className = "only-print";
      div.style.whiteSpace = "pre-wrap";
      div.textContent = input.value || input.placeholder || '';
      input.insertAdjacentElement('afterend', div);

      // 🔁 Під час зміни значення — оновлюємо текст
      input.addEventListener("input", () => {
        div.textContent = input.value || input.placeholder || '';
      });
    });
  };

  updatePrintFields(); // одразу створюємо
  window.addEventListener("beforeprint", updatePrintFields); // оновлюємо перед друком
});

// ===== AUTO RESIZE FONT for PRINT version =====
(function () {
  const input = document.getElementById('project-name');
  const printOut = document.getElementById('project-name-print');

  if (!input || !printOut) return;

  const MIN = 18;  // мінімальний розмір шрифту
  const MAX = 72;  // максимальний розмір шрифту

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function getFont(size) {
    return `700 ${size}px "Times New Roman", serif`;
  }

  function measure(text, size) {
    ctx.font = getFont(size);
    return ctx.measureText(text).width;
  }

  function fitSize(text, containerWidth, min=MIN, max=MAX) {
    if (!text) return min;
    let lo = min, hi = max, best = min;
    for (let i = 0; i < 20; i++) {
      const mid = Math.floor((lo + hi) / 2);
      if (measure(text, mid) <= containerWidth) {
        best = mid; lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best;
  }

  function update() {
    const text = input.value || input.placeholder || '';
    printOut.textContent = text;

    // доступна ширина друкованого контейнера
    const w = printOut.clientWidth || 600;
    const size = fitSize(text, w);

    // задаємо змінну для CSS
    printOut.style.setProperty('--print-size', size + 'px');
  }

  // оновлюємо під час введення та перед друком
  input.addEventListener('input', update);
  window.addEventListener('beforeprint', update);

  update();
})();

// ===== AUTO RESIZE FONT for PRINT only =====
(function () {
  const input = document.getElementById('project-name');
  const printOut = document.getElementById('project-name-print');
  if (!input || !printOut) return;

  const MIN = 18;   // мінімальний кегль на друк
  const MAX = 72;   // максимальний кегль на друк

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function measure(text, size) {
    // на друці використовується Times New Roman (див. твої правила @media print)
    ctx.font = `700 ${size}px "Times New Roman", serif`;
    return ctx.measureText(text).width;
  }

  function fitSize(text, width, min = MIN, max = MAX) {
    if (!text) return min;
    let lo = min, hi = max, best = min;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) >> 1;
      if (measure(text, mid) <= width) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    return best;
  }

  function update() {
    const text = input.value || input.placeholder || '';
    printOut.textContent = text;

    // ширина береться з батька (у друці printOut видимий і має layout)
    const container = printOut.parentElement || printOut;
    const W = (container.clientWidth || 600) * 0.92; // врахуємо max-width:92%
    const size = fitSize(text, W);

    // передаємо кегль у CSS
    printOut.style.setProperty('--print-size', size + 'px');
  }

  // Обновлюємо при вводі та перед друком
  input.addEventListener('input', update);

  // Chrome/Edge: спрацьовує при відкритті діалогу друку
  window.addEventListener('beforeprint', update);

  // Safari/інші: підстрахуємось через matchMedia
  const mm = window.matchMedia('print');
  if (mm && typeof mm.addEventListener === 'function') {
    mm.addEventListener('change', e => { if (e.matches) update(); });
  }

  update();
})();
 