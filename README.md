
# Webbapplikation – Beställning av bakverk

Detta är en frontend byggd i JavaScript, HTML och CSS, och fungerar som användargränssnitt för ett backend-API. Projektet låter användare beställa bakverk, administrera användare, se beställningar och mer.

## 📁 Struktur

- `*.html` – olika sidor som:
  - `administration.html`
  - `bestallBakverk.html`
  - `bestallningar.html`

- `*.js` – JavaScript för varje sida:
  - `auth.js`, `authHeader.js` – autentisering
  - `admin.js`, `bestallningar.js` – sidlogik
  - `adress.js` – hanterar adressdata

## 🔗 Backend-integration

Alla `.js`-filer använder `fetch()` för att kommunicera med backend (API finns i ProjektBackendAPI). Du behöver justera base-URL i dessa filer för att matcha din server (t.ex. `http://localhost:3000`).

## 🧪 Funktioner

- Användarinloggning
- Skyddade sidor via `authHeader.js`
- Beställning av bakverk
- Adminfunktioner: se alla användare och beställningar

## 🚀 Så här kör du

1. Kör backend-servern (se ProjektBackendAPI).
2. Öppna någon av HTML-filerna i webbläsaren, t.ex.:bestallBakverk.html

## 🛡 Säkerhet

- JWT hanteras via `localStorage`
- Token skickas i `Authorization`-header

## ⚙️ Tekniker

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API
