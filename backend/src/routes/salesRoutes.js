const express = require("express");
const router = express.Router();

const {
    getAllSales,
    createSale,
    updateSale,
    deleteSale,
    validateSale,
    cancelSale,
} = require("../controllers/salesController");

router.get("/", getAllSales);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);
router.patch("/:id/validate", validateSale);
router.patch("/:id/cancel", cancelSale);

module.exports = router;