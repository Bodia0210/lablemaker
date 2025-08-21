// ------- Логотипи постачальників -------
const logoMap = {
  "TACO": "svg/taco.svg",
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
