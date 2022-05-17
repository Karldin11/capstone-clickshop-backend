const express = require("express");
const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/", productsControllers.getAllProducts); //added

router.get("/:pid", productsControllers.getProductById);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("price").not().isEmpty(),
    check("imageUrl").not().isEmpty(),
  ],
  productsControllers.createProduct
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("price").not().isEmpty(),
    check("imageUrl").not().isEmpty(),
  ],
  productsControllers.updateProduct
);

router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
