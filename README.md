[English](README.md) | [Українською](README.uk.md)

# KEL Label Maker

A buildless browser app for shipping and warehouse labels at Kehoe Equipment.

![Label preview with synthetic demo data](docs/label-preview.jpg)

## Use

1. Select an optional manufacturer logo and enter the project / customer details.
2. Enter a whole number of pieces (1–100), package type, and total weight in pounds. Leave unknown values blank.
3. Enter each piece’s dimensions as **W × L × H in inches**. Changing or temporarily clearing the quantity preserves these inputs during the current session.
4. Select **Generate Label** to review the label. Use **Edit details** to return without losing your entries.
5. Select **Print / Save PDF**, then choose a printer or “Save as PDF” in the browser’s print dialog. Ctrl/Cmd+P also renders the current entries.

Blank optional fields are omitted from the label. The selected manufacturer logo is loaded before the Print button opens the dialog. Long labels can continue onto additional pages instead of being clipped; the final pagination depends on the printer, paper size, and print settings. For clean output, turn off browser headers and footers.

Entries are kept in memory while the page is open. Reloading or closing the page clears them. The app has no server, account, or cloud storage.

## Develop

```sh
git clone https://github.com/Bodia0210/lablemaker.git
cd lablemaker
python3 -m http.server 8000
```

Open <http://localhost:8000>. No package installation or build is required.

```sh
node --check scripts/main.js
git diff --check
```

For changes to label behavior, check generation, editing, quantity changes (including clearing and restoring), optional fields, manufacturer logos, and printing in a browser. Check long content with the target printer and paper size.

## Files

- `index.html` — accessible editor and label preview.
- `scripts/main.js` — dimension rows, validation, preview rendering, and print preparation.
- `styles/styles.css` — responsive form, shared label styles, and print rules.
- `svg/` — existing manufacturer and KEL logo assets.
