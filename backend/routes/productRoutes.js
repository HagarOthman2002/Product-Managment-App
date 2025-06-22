const express = require("express");
const productController = require("./../controller/productController")
const { authenticateToken } = require("../utilities");
const upload = require("../upload")
const router = express.Router();


router
  .route("/:id")
  .put(authenticateToken, productController.editeProduct)
  .delete(authenticateToken, productController.deleteProduct);

router
  .route("/")
  .post(authenticateToken, upload.single("image"), productController.addProduct)
  .get(authenticateToken, productController.getAllProducts);

module.exports = router;
