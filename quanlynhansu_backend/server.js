const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const nhanvienRoutes = require("./routes/nhanvienRoute");
const phongbanRoutes = require("./routes/phongbanRoute");
const taikhoanRoutes = require("./routes/taikhoanRoute");
const chamcongRoutes = require("./routes/chamcongRoute");
const luongRoutes = require("./routes/luongRoute");
const nghiphepRoutes = require("./routes/nghiphepRoute");
const thongkeRoute = require("./routes/thongkeRoute");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("✅ API Quản Lý Nhân Sự đang hoạt động!"));

// Gắn route
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/phongban", phongbanRoutes);
app.use("/api/taikhoan", taikhoanRoutes);
app.use("/api/chamcong", chamcongRoutes);
app.use("/api/luong", luongRoutes);
app.use("/api/nghiphep", nghiphepRoutes);
app.use("/api/thongke", thongkeRoute);
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
