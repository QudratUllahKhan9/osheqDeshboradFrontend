# Certificates Module — Setup Guide (Hinglish)

## Structure

```
osheq/                      ← aapka AcademyPro dashboard (CRA + React Router)
├── backend/                ← Node/Express certificate engine (NAYA)
│   ├── src/server.js       ← API: generate / list / verify / health
│   ├── src/template.js     ← exact PDF design (original OSHEQ template)
│   ├── src/drive.js        ← Google Drive upload (service account)
│   ├── src/db.js           ← tiny JSON database (data/db.json)
│   ├── assets/bg_clean2.jpg  ← certificate background (bina variable text ke)
│   ├── assets/fonts/         ← Montserrat + EB Garamond (original fonts)
│   ├── pdfs/               ← local PDF copies yahan banti hain
│   ├── .env.example        ← isko copy karke .env banayein
│   └── package.json
└── src/                    ← aapka React frontend (Certificates page merge ho gaya)
    ├── pages/Certificates.jsx     ← NAYA page (form + live preview + history)
    ├── certificates.css           ← certificate preview styles (exact PDF match)
    ├── setupProxy.js              ← dev proxy: /api → localhost:4000
    ├── components/Sidebar.jsx     ← Certificates menu item add ho gaya (NEW badge)
    ├── components/Topbar.jsx      ← page title add ho gaya
    ├── App.jsx                    ← /certificates route add ho gaya
    └── assets/fonts/ + bg_clean2.jpg  ← preview ke liye same assets
```

## 1) Backend chalayen

```bash
cd backend
npm install            # puppeteer bhi chromium download karega (thoda time lagta hai)
cp .env.example .env   # phir .env bharein (neeche)
npm start              # → http://localhost:4000
```

## 2) .env (Google Drive)

1. https://console.cloud.google.com → project banayein
2. APIs & Services → Library → **Google Drive API** → Enable
3. APIs & Services → Credentials → **Create Credentials → Service Account**
4. Service account → Keys → **Add Key → JSON** → file download hogi
5. `.env` mein (koi ek option):

```ini
PORT=4000
PUBLIC_BASE_URL=http://localhost:4000     # deploy ke baad apna domain
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64 -w0 service-account.json ka output>
GOOGLE_DRIVE_FOLDER_ID=<drive folder ki ID — optional>
QR_MODE=verify
```

6. Drive folder ko service account email ke sath share karein (Editor).

## 3) Frontend chalayen

```bash
# project root par:
npm install
npm start              # → http://localhost:3000
```

Sidebar mein **Certificates (NEW)** → form bharein → **Generate** → PDF banta hai,
Google Drive par upload hota hai, QR usi verify link par scan hota hai.
PDF ka naam = certificate number (`00123412.pdf`).

## 4) QR scan flow

- QR → `<PUBLIC_BASE_URL>/api/verify/<id>` → valid certificate page + Drive download link
- `QR_MODE=direct` karein to QR seedha Drive file par jata hai

## 5) API quick reference

| Method | Route | Kaam |
|---|---|---|
| POST | /api/certificates | `{name, course, provider, date, certNo}` → PDF + Drive + QR |
| GET | /api/certificates | saari certificates |
| GET | /api/verify/:id | QR scan target |
| GET | /api/drive-status | Drive configured? |
| GET | /pdfs/:file | local PDF download |
