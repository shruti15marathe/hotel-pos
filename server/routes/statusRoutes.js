const express = require("express");
const router = express.Router();

const { updateStatus } = require("../controllers/statusController");

router.patch("/:order_id", updateStatus);

module.exports = router;