const express = require("express");
const router = express.Router();

const {
  createBill,
  payBill,
  getCompletedOrders,
  getInvoice
} = require("../controllers/billingController");

router.get("/orders", getCompletedOrders);

router.post("/", createBill);

router.patch("/pay", payBill);

router.get("/invoice/:bill_id", getInvoice);

module.exports = router;