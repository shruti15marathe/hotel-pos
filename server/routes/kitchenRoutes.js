const express = require("express");
const router = express.Router();

const { getKitchenOrders } = require("../controllers/kitchenController");

router.get("/orders", getKitchenOrders);

module.exports = router;