"use strict";

const logoMap = Object.freeze({
  "ALGGIN": "svg/Algginlogo1.png",
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
  "HSL": "svg/hsl.png",
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
});

window.addEventListener("DOMContentLoaded", () => {
  const byId = id => document.getElementById(id);
  const form = byId("labelForm");
  const quantityInput = byId("total-pieces");
  const dimensionsContainer = byId("dimensionsContainer");
  const previewPanel = byId("previewPanel");
  const status = byId("status");
  // Keep the actual inputs so reducing or temporarily clearing quantity never loses data.
  const dimensionRows = [];
  const maxPieces = Number(quantityInput.max);

  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  byId("delivery-time-date").value = `${pad(now.getHours())}${pad(now.getMinutes())} ${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;

  function quantityState() {
    const raw = quantityInput.value.trim();
    if (!raw && !quantityInput.validity.badInput) return { count: 0, error: "" };
    const count = Number(raw);
    const valid = /^\d+$/.test(raw) && Number.isSafeInteger(count) && count >= 1 && count <= maxPieces;
    return valid
      ? { count, error: "" }
      : { count: 0, error: `Enter a whole number from 1 to ${maxPieces}.` };
  }

  function syncDimensionRows() {
    const { count, error } = quantityState();
    quantityInput.setCustomValidity(error);
    quantityInput.setAttribute("aria-invalid", String(Boolean(error)));
    byId("pieces-error").textContent = error;
    if (error) return;

    while (dimensionRows.length < count) {
      const number = dimensionRows.length + 1;
      const row = document.createElement("div");
      row.className = "field";
      const label = document.createElement("label");
      label.htmlFor = `dimension-${number}`;
      label.textContent = `Piece ${number}`;
      const input = document.createElement("input");
      input.type = "text";
      input.id = label.htmlFor;
      input.name = `dimension${number}`;
      input.placeholder = "e.g. 48 × 40 × 50";
      row.append(label, input);
      dimensionsContainer.append(row);
      dimensionRows.push({ row, input });
    }
    dimensionRows.forEach(({ row }, index) => { row.hidden = index >= count; });
    byId("dimensionsSection").hidden = count === 0;
  }

  function updateLogo() {
    const company = byId("companySelect").value;
    const src = logoMap[company];
    const image = byId("company-logo");
    image.hidden = !src;
    image.alt = src ? `${company} logo` : "";
    if (src) {
      if (image.getAttribute("src") !== src) image.src = src;
    } else {
      image.removeAttribute("src");
    }
  }

  function renderLabel() {
    updateLogo();
    byId("project-name-print").textContent = byId("project-name").value.trim() || "Warehouse Label";

    const details = document.createDocumentFragment();
    [
      ["company", "Sold to"],
      ["customer-po", "Customer PO"],
      ["project-number", "Project ID"],
      ["kel-po", "KEL PO#"],
      ["contact-person", "Project lead"]
    ].forEach(([id, caption]) => {
      const value = byId(id).value.trim();
      if (!value) return;
      const row = document.createElement("div");
      row.className = "label-row";
      const term = document.createElement("dt");
      term.textContent = `${caption}:`;
      const description = document.createElement("dd");
      description.textContent = value;
      row.append(term, description);
      details.append(row);
    });
    byId("label-details").replaceChildren(details);

    const { count } = quantityState();
    const packageType = byId("package-type").value;
    const weight = byId("total-weight").value.trim();
    const summary = byId("shipment-summary");
    summary.replaceChildren();
    const pieces = [count || "", packageType].filter(Boolean).join(" ");
    if (pieces) {
      const item = document.createElement("p");
      item.textContent = count && !packageType ? `Total pieces: ${count}` : pieces;
      summary.append(item);
    }
    if (weight) {
      const item = document.createElement("p");
      item.textContent = `Total weight: ${weight} lbs`;
      summary.append(item);
    }
    summary.hidden = !summary.childElementCount;

    const dimensions = document.createDocumentFragment();
    dimensionRows.slice(0, count).forEach(({ input }, index) => {
      const value = input.value.trim();
      if (!value) return;
      const item = document.createElement("p");
      item.className = "dimension-item";
      item.textContent = `Piece ${index + 1}: ${value}`;
      dimensions.append(item);
    });
    byId("dimension-values").replaceChildren(dimensions);
    byId("dimensions-print").hidden = !byId("dimension-values").childElementCount;

    const location = byId("location").value;
    byId("location-print").textContent = location ? `Location: ${location}` : "";
    byId("location-print").hidden = !location;
    byId("delivery-time-print").textContent = `Delivery: ${byId("delivery-time-date").value}`;
  }

  function validate() {
    syncDimensionRows();
    if (form.checkValidity()) return true;
    // Reveal invalid controls even when the user was viewing the preview.
    showEditor();
    form.reportValidity();
    status.textContent = "Check the highlighted field before generating or printing.";
    return false;
  }

  function showPreview() {
    renderLabel();
    form.hidden = true;
    previewPanel.hidden = false;
    byId("generateBtn").hidden = true;
    byId("editBtn").hidden = false;
    byId("previewHeading").focus();
  }

  function showEditor() {
    form.hidden = false;
    previewPanel.hidden = true;
    byId("generateBtn").hidden = false;
    byId("editBtn").hidden = true;
  }

  form.addEventListener("input", event => {
    if (event.target === quantityInput) syncDimensionRows();
    renderLabel();
    status.textContent = "";
  });
  form.addEventListener("change", renderLabel);
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate()) return;
    showPreview();
    status.textContent = "Preview ready. Review the label, then print or save it as a PDF.";
  });
  byId("editBtn").addEventListener("click", () => {
    showEditor();
    byId("project-name").focus();
    status.textContent = "";
  });

  byId("printBtn").addEventListener("click", async () => {
    if (!validate()) return;
    showPreview();
    const button = byId("printBtn");
    button.disabled = true;
    try {
      // Wait for the selected logo before opening the print dialog.
      const images = [...byId("printArea").querySelectorAll("img")].filter(image => !image.hidden);
      await Promise.all(images.map(image => image.decode()));
      status.textContent = "Choose your printer or Save as PDF in the print dialog.";
      window.print();
    } catch {
      status.textContent = "A logo could not load. Check your connection and try printing again.";
    } finally {
      button.disabled = false;
    }
  });

  // Ctrl/Cmd+P follows the same rendering path, including newly added dimensions.
  window.addEventListener("beforeprint", () => {
    syncDimensionRows();
    renderLabel();
  });

  syncDimensionRows();
  renderLabel();
});
