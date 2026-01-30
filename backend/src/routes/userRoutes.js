const express = require("express");
const upload = require("../config/multer");
const {createUser,getUsers,getSingleUser,updateUser,deleteUser,searchUsers,exportCSV} = require("../controllers/userController");

const router = express.Router();


router.post("/", upload.single("profile"), createUser);
router.put("/:id", upload.single("profile"), updateUser);
router.get("/", getUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);
router.get("/search/:key", searchUsers);

router.get("/export/csv", exportCSV);

module.exports = router;