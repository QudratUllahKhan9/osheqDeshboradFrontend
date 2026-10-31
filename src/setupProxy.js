/**
 * CRA dev proxy.
 * Frontend port 3000 -> backend port 4000.
 * /v is included so the QR verify page can also be opened from the dev origin.
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

const TARGET = process.env.REACT_APP_API_URL || "http://localhost:4000";

module.exports = function (app) {
  ["/api", "/pdfs", "/previews", "/v"].forEach((path) => {
    app.use(path, createProxyMiddleware({ target: TARGET, changeOrigin: true }));
  });
};
