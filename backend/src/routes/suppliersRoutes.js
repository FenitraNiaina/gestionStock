const express = require("express");
const router = express.Router();

const {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/suppliersController");

router.get("/", getAllSuppliers);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;