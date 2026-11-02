const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
} = require("../controllers/usersController");

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/toggle-status", toggleStatus);
router.delete("/:id", deleteUser);

module.exports = router;