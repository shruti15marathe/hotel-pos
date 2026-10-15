const express = require("express");

const router = express.Router();


const {
  createOrder,
  acknowledgeOrder,
  getReadyOrders
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/ready", getReadyOrders);
router.post("/:orderId/acknowledge", acknowledgeOrder);

module.exports = router;