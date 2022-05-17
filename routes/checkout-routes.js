const express = require("express");
const { check } = require("express-validator");

const checkoutControllers = require("../controllers/checkout-controllers");

const router = express.Router();

router.get("/cart/:uid", checkoutControllers.getUserOrders);

router.post("/cart/:uid/:pid", checkoutControllers.addProductToOrders);

router.delete("/cart/:uid/:pid", checkoutControllers.removeProductFromOrders);

router.post(
  "/receipts/:uid",
  [check("address").not().isEmpty(), check("total").not().isEmpty()],
  checkoutControllers.addReceipt
);
router.get("/receipts/", checkoutControllers.getAllReceipts);
router.get("/receipts/:uid", checkoutControllers.getUserReceipts);

module.exports = router;
