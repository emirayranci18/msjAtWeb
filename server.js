const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// public klasörünü statik sun
app.use(express.static(path.join(__dirname, "public")));

// Ana sayfa (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
