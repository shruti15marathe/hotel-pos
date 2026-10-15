const express = require("express");
const router = express.Router();

const {
  getHotel,
  updateHotel
} = require("../controllers/hotelController");

router.get("/", getHotel);

router.put("/", updateHotel);

module.exports = router;