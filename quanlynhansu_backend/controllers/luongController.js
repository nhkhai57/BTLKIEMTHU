const Luong = require("../models/luongModel");
const pool = require("../db/pool");

// 📋 Lấy danh sách lương
exports.getAll = async (req, res) => {
  try {
    const data = await Luong.getAll();
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi lấy danh sách lương:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách lương" });
  }
};

// ➕ Thêm bản ghi lương
exports.create = async (req, res) => {
  try {
    const { nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong } = req.body;

    // ⚠️ Kiểm tra dữ liệu bắt buộc
    if (!nhanvien_id || !thang || !luong_co_ban) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc (nhân viên, tháng, lương cơ bản)" });
    }

    // ⚠️ Kiểm tra nhân viên tồn tại
    const checkNV = await pool.query("SELECT * FROM nhanvien WHERE id=$1", [nhanvien_id]);
    if (checkNV.rows.length === 0) {
      return res.status(400).json({ message: "Mã nhân viên không tồn tại" });
    }

    // ⚠️ Kiểm tra trùng tháng lương
    const checkLuong = await pool.query(
      "SELECT * FROM luong WHERE nhanvien_id=$1 AND thang=$2",
      [nhanvien_id, thang]
    );
    if (checkLuong.rows.length > 0) {
      return res.status(400).json({ message: "Nhân viên này đã có bản lương trong tháng này" });
    }

    // ✅ Tính tổng lương nếu chưa có
    const tong = tong_luong || Number(luong_co_ban) + (Number(phu_cap) || 0) - (Number(khau_tru) || 0);

    const luong = await Luong.create({
      nhanvien_id,
      thang,
      luong_co_ban,
      phu_cap,
      khau_tru,
      tong_luong: tong,
    });

    res.status(201).json({ message: "✅ Thêm bản lương thành công!", data: luong });
  } catch (err) {
    console.error("💥 Lỗi thêm lương:", err);
    if (err.code === "23503") {
      return res.status(400).json({ message: "Mã nhân viên không hợp lệ (FK constraint)" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm lương" });
  }
};

// ✏️ Cập nhật lương
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { luong_co_ban, phu_cap, khau_tru } = req.body;

    const luongOld = await Luong.getById(id);
    if (!luongOld) {
      return res.status(404).json({ message: "Không tìm thấy bản lương để cập nhật" });
    }

    const tong_luong =
      Number(luong_co_ban) + (Number(phu_cap) || 0) - (Number(khau_tru) || 0);

    const luong = await Luong.update(id, {
      luong_co_ban,
      phu_cap,
      khau_tru,
      tong_luong,
    });

    res.json({ message: "✅ Cập nhật lương thành công!", data: luong });
  } catch (err) {
    console.error("💥 Lỗi cập nhật lương:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật lương" });
  }
};

// 🗑️ Xóa bản ghi lương
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const luong = await Luong.getById(id);
    if (!luong) {
      return res.status(404).json({ message: "Không tìm thấy bản lương để xóa" });
    }

    await Luong.delete(id);
    res.json({ message: "🗑️ Đã xóa bản lương thành công!" });
  } catch (err) {
    console.error("💥 Lỗi xóa lương:", err);
    res.status(500).json({ message: "Lỗi server khi xóa bản lương" });
  }
};
