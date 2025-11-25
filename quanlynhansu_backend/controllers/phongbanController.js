const PhongBan = require("../models/phongbanModel");
const pool = require("../db/pool");

// 📜 Lấy danh sách tất cả phòng ban
exports.getAll = async (req, res) => {
  try {
    const data = await PhongBan.getAll();
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi lấy danh sách phòng ban:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách phòng ban" });
  }
};

exports.create = async (req, res) => {
  try {
    const { tenphong } = req.body;

    if (!tenphong || tenphong.trim() === "") {
      return res.status(400).json({ message: "Tên phòng ban không được để trống" });
    }

    // ⚠️ Kiểm tra trùng tên (bỏ qua phân biệt hoa thường)
    const check = await pool.query(
      "SELECT * FROM phongban WHERE LOWER(tenphong) = LOWER($1)",
      [tenphong]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Phòng ban đã tồn tại!" });
    }

    const pb = await PhongBan.create({ tenphong });
    res.status(201).json({ message: "✅ Thêm phòng ban thành công!", data: pb });
  } catch (err) {
    console.error("💥 Lỗi thêm phòng ban:", err);
    res.status(500).json({ message: "Lỗi server khi thêm phòng ban" });
  }
};


// ✏️ Cập nhật phòng ban
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { tenphong } = req.body;

    // Kiểm tra có tồn tại không
    const pbOld = await PhongBan.getById(id);
    if (!pbOld) {
      return res.status(404).json({ message: "Không tìm thấy phòng ban để cập nhật" });
    }

    // Kiểm tra trùng tên (trừ chính nó)
    const check = await pool.query(
      "SELECT * FROM phongban WHERE LOWER(tenphong)=LOWER($1) AND id<>$2",
      [tenphong, id]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Tên phòng ban đã tồn tại" });
    }

    const pb = await PhongBan.update(id, { tenphong });
    res.json({ message: "Cập nhật phòng ban thành công!", data: pb });
  } catch (err) {
    console.error("💥 Lỗi cập nhật phòng ban:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật phòng ban" });
  }
};

// 🗑️ Xóa phòng ban
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra tồn tại
    const pb = await PhongBan.getById(id);
    if (!pb) {
      return res.status(404).json({ message: "Không tìm thấy phòng ban để xóa" });
    }

    // Kiểm tra ràng buộc với bảng nhân viên
    const checkNV = await pool.query("SELECT * FROM nhanvien WHERE phong_ban=$1", [id]);
    if (checkNV.rows.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa vì còn nhân viên thuộc phòng ban này",
      });
    }

    await PhongBan.delete(id);
    res.json({ message: "Đã xóa phòng ban thành công!" });
  } catch (err) {
    console.error("💥 Lỗi xóa phòng ban:", err);
    if (err.code === "23503") {
      // ràng buộc khóa ngoại
      return res.status(400).json({ message: "Phòng ban có nhân viên, không thể xóa!" });
    }
    res.status(500).json({ message: "Lỗi server khi xóa phòng ban" });
  }
};
