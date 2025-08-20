// КАРТА ЛОГОТИПІВ (ключі = value у <select>)
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
  // логотип постачальника
  const companySelect = document.getElementById("companySelect");
  const logoImg = document.getElementById("company-logo");

  const updateLogo = () => {
    const key = companySelect?.value || "";
    logoImg.src = logoMap[key] || "";
    logoImg.alt = key ? `${key} Logo` : "Company Logo";
  };
  companySelect?.addEventListener("change", updateLogo);
  updateLogo();

  // дата/час (формат як приклад, підженеш під свій)
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");
  const formatted = `${pad(now.getHours())}${pad(now.getMinutes())} ${pad(now.getMonth()+1)}/${pad(now.getDate())}/${now.getFullYear()}`;
  const dt = document.getElementById("delivery-time-date");
  if (dt) dt.value = formatted;

  // автогенерація полів Dimensions
  const totalPiecesInput = document.getElementById("total-pieces");
  const dimensionsContainer = document.getElementById("dimensionsContainer");

  totalPiecesInput?.addEventListener("input", () => {
    const count = parseInt(totalPiecesInput.value, 10);
    dimensionsContainer.innerHTML = "";
    if (!isNaN(count) && count > 0) {
      for (let i = 1; i <= count; i++) {
        const wrap = document.createElement("div");
        wrap.className = "field";
        const label = document.createElement("label");
        label.textContent = `Dimensions ${i}:`;
        const input = document.createElement("input");
        input.type = "text";
        input.name = `dimension${i}`;
        input.placeholder = `WxLxH ${i}`;
        input.className = "short";
        wrap.append(label, input);
        dimensionsContainer.appendChild(wrap);
      }
    }
  });

  // ДРУК
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
});
