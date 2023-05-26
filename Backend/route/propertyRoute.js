const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  property,
  getProperty,
  singleProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

router.route("/property").get(getProperty);
router
  .route("/newProperty")
  .post(isAuthenticatedUser, property);
router.route("/singleProperty/:id").get(singleProperty);
router
  .route("/updateProperty/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProperty);
router
  .route("/deleteProperty/:id")
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProperty);

module.exports = router;
