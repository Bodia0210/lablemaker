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

const packageTypes = Object.freeze({
  Skid: { singular: "Skid", plural: "Skids" },
  Crate: { singular: "Crate", plural: "Crates" },
  Box: { singular: "Box", plural: "Boxes" }
});
const MAX_PIECES = 100;

window.addEventListener("DOMContentLoaded", () => {
  const byId = id => document.getElementById(id);
  const form = byId("labelForm");
  const dimensionsContainer = byId("dimensionsContainer");
  const previewPanel = byId("previewPanel");
  const status = byId("status");
  const packageRows = [];
  const manufacturerInputs = [];
  const manufacturerImages = new Map();
  let nextPackageId = 1;
  let activePieces = [];

  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  byId("delivery-time-date").value = `${pad(now.getHours())}${pad(now.getMinutes())} ${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;

  Object.keys(logoMap).sort((a, b) => a.localeCompare(b)).forEach((company, index) => {
    const label = document.createElement("label");
    label.className = "manufacturer-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `manufacturer-${index + 1}`;
    input.name = "manufacturers";
    input.value = company;
    const caption = document.createElement("span");
    caption.textContent = company;
    label.append(input, caption);
    byId("manufacturer-options").append(label);
    manufacturerInputs.push(input);
  });

  function addPackageRow() {
    if (packageRows.length >= MAX_PIECES) return;
    const id = nextPackageId++;
    const row = document.createElement("div");
    row.className = "package-row";
    const typeField = document.createElement("div");
    typeField.className = "field";
    const typeLabel = document.createElement("label");
    typeLabel.htmlFor = `package-type-${id}`;
    const type = document.createElement("select");
    type.id = typeLabel.htmlFor;
    type.name = `packageType${id}`;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select package type";
    type.append(placeholder);
    Object.keys(packageTypes).forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      type.append(option);
    });
    typeField.append(typeLabel, type);
    const quantityField = document.createElement("div");
    quantityField.className = "field";
    const quantityLabel = document.createElement("label");
    quantityLabel.htmlFor = `package-count-${id}`;
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = quantityLabel.htmlFor;
    quantity.name = `packageCount${id}`;
    quantity.min = "1";
    quantity.max = String(MAX_PIECES);
    quantity.step = "1";
    quantity.inputMode = "numeric";
    quantityField.append(quantityLabel, quantity);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary remove-package";
    remove.textContent = "Remove";
    const error = document.createElement("p");
    error.id = `package-error-${id}`;
    error.className = "field-error package-row-error";
    type.setAttribute("aria-describedby", error.id);
    quantity.setAttribute("aria-describedby", error.id);
    row.append(typeField, quantityField, remove, error);
    const entry = { id, row, type, typeLabel, quantity, quantityLabel, remove, error, dimensions: [] };
    type.addEventListener("input", () => {
      if (type.value && !quantity.value && !quantity.validity.badInput) quantity.value = "1";
    });
    remove.addEventListener("click", () => {
      const index = packageRows.indexOf(entry);
      packageRows.splice(index, 1);
      entry.dimensions.forEach(piece => piece.row.remove());
      row.remove();
      if (!packageRows.length) addPackageRow();
      renderLabel();
      const next = packageRows[Math.min(index, packageRows.length - 1)];
      next.type.focus();
      status.textContent = "Package row removed. Total pieces updated.";
    });
    packageRows.push(entry);
    byId("package-rows").append(row);
    return entry;
  }

  function packagingState() {
    let total = 0;
    let valid = true;
    const entries = [];
    packageRows.forEach((entry, index) => {
      entry.typeLabel.textContent = `Package type ${index + 1}`;
      entry.quantityLabel.textContent = `Quantity ${index + 1}`;
      entry.remove.setAttribute("aria-label", `Remove package row ${index + 1}`);
      const raw = entry.quantity.value.trim();
      const active = Boolean(entry.type.value || raw || entry.quantity.validity.badInput);
      const count = Number(raw);
      const countValid = /^\d+$/.test(raw) && Number.isSafeInteger(count) && count >= 1 && count <= MAX_PIECES;
      const typeError = active && !packageTypes[entry.type.value] ? "Select a package type." : "";
      const countError = active && !countValid ? `Enter a whole quantity from 1 to ${MAX_PIECES}.` : "";
      entry.type.setCustomValidity(typeError);
      entry.quantity.setCustomValidity(countError);
      entry.type.setAttribute("aria-invalid", String(Boolean(typeError)));
      entry.quantity.setAttribute("aria-invalid", String(Boolean(countError)));
      entry.error.textContent = typeError || countError;
      if (typeError || countError) valid = false;
      if (active && !typeError && !countError) {
        entries.push({ entry, count, type: entry.type.value });
        total += count;
      }
    });
    if (total > MAX_PIECES) {
      valid = false;
      const last = entries[entries.length - 1].entry;
      const message = `Combined shipment cannot exceed ${MAX_PIECES} pieces.`;
      last.quantity.setCustomValidity(message);
      last.quantity.setAttribute("aria-invalid", "true");
      last.error.textContent = message;
    }
    byId("packaging-error").textContent = valid ? "" : "Check the package rows to calculate the shipment total.";
    byId("total-pieces").value = valid && total ? String(total) : "";
    byId("addPackageBtn").disabled = packageRows.length >= MAX_PIECES;
    return { valid, total, entries };
  }

  function syncDimensionRows(state) {
    activePieces = [];
    const visibleRows = new Set();
    if (state.valid) {
      const typeCounts = new Map();
      state.entries.forEach(({ entry, count, type }) => {
        while (entry.dimensions.length < count) {
          const number = entry.dimensions.length + 1;
          const row = document.createElement("div");
          row.className = "field";
          const label = document.createElement("label");
          label.htmlFor = `dimension-${entry.id}-${number}`;
          const input = document.createElement("input");
          input.type = "text";
          input.id = label.htmlFor;
          input.name = `dimensionPackage${entry.id}Piece${number}`;
          input.placeholder = "e.g. 48 × 40 × 50";
          row.append(label, input);
          entry.dimensions.push({ row, label, input });
        }
        entry.dimensions.slice(0, count).forEach(piece => {
          const ordinal = (typeCounts.get(type) || 0) + 1;
          typeCounts.set(type, ordinal);
          const caption = `${packageTypes[type].singular} ${ordinal}`;
          piece.label.textContent = `${caption} — piece ${activePieces.length + 1}`;
          visibleRows.add(piece.row);
          activePieces.push({ row: piece.row, input: piece.input, caption });
        });
      });
    }
    // Leave rows in place while typing so focus and the caret stay in the input.
    let cursor = dimensionsContainer.firstElementChild;
    activePieces.forEach(piece => {
      if (piece.row !== cursor) dimensionsContainer.insertBefore(piece.row, cursor);
      cursor = piece.row.nextElementSibling;
    });
    packageRows.forEach(entry => entry.dimensions.forEach(piece => {
      piece.row.hidden = !visibleRows.has(piece.row);
    }));
    byId("dimensionsSection").hidden = !activePieces.length;
  }

  function updateLogos() {
    const companies = manufacturerInputs.filter(input => input.checked).map(input => input.value);
    const container = byId("manufacturer-logos");
    byId("manufacturer-selection").textContent = companies.join(", ") || "Choose manufacturers";
    for (const image of [...container.children]) {
      if (!companies.includes(image.dataset.company)) image.remove();
    }
    companies.forEach(company => {
      let image = manufacturerImages.get(company);
      if (!image) {
        image = document.createElement("img");
        image.src = logoMap[company];
        image.alt = `${company} logo`;
        image.className = "logo-right";
        image.dataset.company = company;
        manufacturerImages.set(company, image);
      }
      container.append(image);
    });
    container.hidden = !companies.length;
  }

  function renderLabel() {
    const state = packagingState();
    syncDimensionRows(state);
    updateLogos();
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

    const weight = byId("total-weight").value.trim();
    const summary = byId("shipment-summary");
    summary.replaceChildren();
    if (state.valid && state.total) {
      const totalsByType = new Map();
      state.entries.forEach(({ type, count }) => totalsByType.set(type, (totalsByType.get(type) || 0) + count));
      const breakdown = document.createElement("p");
      breakdown.className = "package-breakdown";
      breakdown.textContent = [...totalsByType].map(([type, count]) => `${count} ${packageTypes[type][count === 1 ? "singular" : "plural"]}`).join(" + ");
      const total = document.createElement("p");
      total.textContent = `Total pieces: ${state.total}`;
      summary.append(breakdown, total);
    }
    if (weight) {
      const item = document.createElement("p");
      item.textContent = `Total weight: ${weight} lbs`;
      summary.append(item);
    }
    summary.hidden = !summary.childElementCount;

    const dimensions = document.createDocumentFragment();
    activePieces.forEach(({ input, caption }) => {
      const value = input.value.trim();
      if (!value) return;
      const item = document.createElement("p");
      item.className = "dimension-item";
      item.textContent = `${caption}: ${value}`;
      dimensions.append(item);
    });
    byId("dimension-values").replaceChildren(dimensions);
    byId("dimensions-print").hidden = !byId("dimension-values").childElementCount;

    const location = byId("location").value;
    byId("location-print").textContent = location ? `Location: ${location}` : "";
    byId("location-print").hidden = !location;
    byId("delivery-time-print").textContent = `Delivery: ${byId("delivery-time-date").value}`;
    return state;
  }

  function validate() {
    const state = renderLabel();
    if (state.valid && form.checkValidity()) return true;
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

  byId("addPackageBtn").addEventListener("click", () => {
    const entry = addPackageRow();
    renderLabel();
    entry?.type.focus();
    status.textContent = "";
  });
  form.addEventListener("input", () => {
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
      const images = [...byId("printArea").querySelectorAll("img")];
      await Promise.all(images.map(image => image.decode()));
      status.textContent = "Choose your printer or Save as PDF in the print dialog.";
      window.print();
    } catch {
      status.textContent = "A logo could not load. Check your connection and try printing again.";
    } finally {
      button.disabled = false;
    }
  });

  // Ctrl/Cmd+P uses the current packaging breakdown and selected manufacturers too.
  window.addEventListener("beforeprint", renderLabel);

  addPackageRow();
  renderLabel();
});
