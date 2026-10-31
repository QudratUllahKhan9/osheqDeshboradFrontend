# OSHEQ Certificate System — Integrated (Cloudinary + QR Verify)

Do projects merge kar diye gaye hain:

```
osheq/                      <-- React dashboard (CRA) + backend folder
├── backend/                <-- Certificate engine (Express + Puppeteer + Cloudinary)
│   ├── src/server.js       <-- API: generate / list / verify / qr / pdf
│   ├── src/cloudinary.js   <-- Cloudinary upload + deterministic public_id + signed URL
│   ├── src/config.js       <-- PUBLIC_BASE_URL check + localhost warning
│   ├── src/render.js       <-- HTML -> PDF + PNG (ek hi Chromium)
│   ├── src/template.js     <-- original OSHEQ PDF design (pixel-matched)
│   ├── src/verifyPage.js   <-- QR scan karne par jo page khulta hai
│   ├── src/db.js           <-- local JSON cache (Cloudinary = source of truth)
│   ├── api/index.js        <-- Vercel serverless entry
│   ├── vercel.json
│   ├── .env / .env.example
│   └── test/               <-- automated checks (selfcheck, cloudinary-check)
└── src/
    ├── pages/Certificates.jsx   <-- form + live preview + status + history
    ├── certificates.css         <-- preview styles
    ├── certificates-extra.css   <-- badges / status card styles
    └── setupProxy.js            <-- /api /v /pdfs /previews -> localhost:4000
```

---

## 1) Backend chalayen

```bash
cd backend
npm install
npm start            # -> http://localhost:4000
```

`.env` pehle se bhara hua hai aap ki Cloudinary keys ke sath. Agar missing ho:

```ini
PORT=4000
PUBLIC_BASE_URL=http://localhost:4000

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Windows local only — Vercel par set na karein
CHROME_PATH=C:/Program Files/Google/Chrome/Application/chrome.exe
```

## 2) Frontend chalayen

```bash
npm install
npm start            # -> http://localhost:3000
```

Sidebar -> **Certificates** -> form bharein -> **Generate**.

## 3) QR kaise kaam karta hai (asli logic)

Problem: QR certificate ke andar print hota hai, lekin Cloudinary ka URL
upload ke **baad** banta hai. To QR me Cloudinary URL daalna impossible hai.

Solution — deterministic `public_id`:

```
localId = certificate number (sanitized)      <-- PDF render se PEHLE banta hai
QR     = https://<domain>/v/<localId>         <-- render ke waqt hi valid
Cloudinary: osheq-certificates/pdf/<localId>.pdf      (raw)
            osheq-certificates/preview/<localId>.png  (image)
```

Kyunki public_id pehle se decide hai, `/v/<localId>` ko pehle se pata hai file
kahan jayegi. Upload hone ke baad wahi QR kaam karta hai — koi re-render nahi.

`/v/<id>` kya karta hai:
1. Local cache me dekhta hai
2. Na mile to (Vercel cold start) **Cloudinary metadata** se record rebuild karta hai
3. Certificate preview (PNG) + Download PDF button dikhata hai

## 4) Sabse bada trap: localhost

QR me `localhost` hai to **doosre phone par kabhi nahi khulega** — phone ka
localhost usi ka apna device hota hai. Is liye:

- Deploy karein aur `PUBLIC_BASE_URL=https://your-domain` rakhein
- UI me warning automatically dikh jayegi agar base URL HTTPS/localhost ho
- Same WiFi test ke liye backend console LAN IP print karta hai

## 5) Cloudinary PDF trap (test se pakda gaya)

Cloudinary raw PDF ko public URL se **HTTP 401** deta hai (account setting).
Test result: `plain secure_url -> 401`, `signed url -> 200 application/pdf`.

Is liye PDF link `/api/pdf/<id>` se jata hai jo har click par naya **signed**
download URL banata hai. Preview PNG normal URL se chalta hai (200 image/png).

## 6) Deploy (Vercel)

1. `backend` folder ko GitHub par push karein (`.env` push na karein)
2. Vercel -> Import -> Root Directory = `backend`
3. Environment Variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PUBLIC_BASE_URL=https://your-project.vercel.app`
4. Redeploy -> `https://your-project.vercel.app/api/status` check karein
5. React dashboard ko alag deploy karein aur `REACT_APP_API_URL` backend URL par set karein
   (ya `setupProxy.js` me target badal dein)

## 7) API

| Method | Route | Kaam |
|---|---|---|
| GET | `/api/status` | Cloudinary + public URL + warnings |
| POST | `/api/certificates` | PDF + PNG render, Cloudinary upload, QR |
| GET | `/api/certificates` | list (Cloudinary se) |
| GET | `/v/:id` | **QR scan target** — verified certificate page |
| GET | `/api/pdf/:id` | signed PDF download |
| GET | `/api/qr/:id` | QR PNG (print ke liye) |
| GET | `/api/verify/:id` | purane QR codes -> `/v/:id` redirect |

## 8) Tests

```bash
cd backend
node test/selfcheck.js nocloud      # PDF/PNG render check
node test/cloudinary-check.js       # real Cloudinary upload + /v/ page check
```

Verified output: PDF 735 KB, PNG 794 KB, QR decode = `https://<domain>/v/<certNo>`,
`/v/:id` = 200, PDF download = `200 application/pdf`, preview = `200 image/png`.

> Note: `.env` me aap ki Cloudinary secret hai. Ye file kisi ke sath share na karein.
