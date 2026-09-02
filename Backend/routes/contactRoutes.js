const express = require("express");
const router = express.Router();
const contactController = require("../controllers/Contact");

router.post("/send", contactController.sendContactMessage);

module.exports = router;
