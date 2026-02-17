# Hong Kong Tram Fortune Ticket Machine — CNY 2026

A vintage Hong Kong tram ticket machine. Crank the handle to dispense tickets with bilingual (Chinese + English) fortunes printed on them.

## Quick Start

Open `index.html` in a browser — no build step required.

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

## How It Works

1. Click the brass crank handle on the machine
2. The counter rolls, the crank spins
3. A fortune ticket slides out of the slot
4. Collected tickets stack below the machine

## Customizing

### Add/edit fortunes

Edit `js/fortunes.js` — each fortune has Chinese and English text:

```js
{ cn: "一帆風順", en: "Smooth sailing in all your endeavours" }
```

### Replace machine artwork

Drop your own assets into `assets/images/` and update references in `index.html`.

## Folder Structure

```
├── index.html
├── css/style.css
├── js/
│   ├── app.js          ← machine logic & interactions
│   └── fortunes.js     ← fortune data (bilingual)
├── assets/
│   ├── images/
│   └── sounds/
└── README.md
```
