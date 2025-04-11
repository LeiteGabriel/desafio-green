const express = require("express");
const multer = require("multer");
const { importarCSV } = require("../controllers/boletoController");
const { dividirPdf, listarBoletos } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/importar-csv", upload.single("file"), importarCSV);
router.post("/dividir-pdf", upload.single("file"), dividirPdf);
router.get("/", listarBoletos);

module.exports = router;
