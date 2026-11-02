const express = require("express");
const router = express.Router();

const {
    getAllPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
    receivePurchase,
    changeStatus,
} = require("../controllers/purchasesController");

router.get("/", getAllPurchases);
router.post("/", createPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);
router.patch("/:id/receive", receivePurchase);
router.patch("/:id/status", changeStatus);

module.exports = router;