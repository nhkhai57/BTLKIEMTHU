const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/thongkeController");

router.get("/", ctrl.getThongKeTongQuat);
module.exports = router;
