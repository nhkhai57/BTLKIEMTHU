const NhanVien = require("../models/nhanvienModel");
const pool = require("../db/pool");

// 📜 Lấy tất cả nhân viên
exports.getAll = async (req, res) => {
  try {
    const data = await NhanVien.getAll();
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi lấy danh sách nhân viên:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách nhân viên" });
  }
};

// 🔍 Lấy nhân viên theo ID
exports.getById = async (req, res) => {
  try {
    const nv = await NhanVien.getById(req.params.id);
    if (!nv)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json(nv);
  } catch (err) {
    console.error("💥 Lỗi truy vấn nhân viên:", err);
    res.status(500).json({ message: "Lỗi truy vấn nhân viên" });
  }
};

// ➕ Thêm nhân viên mới
exports.create = async (req, res) => {
  try {
    const { ten, gioi_tinh, chuc_vu, phong_ban } = req.body;

    // ⚠️ Kiểm tra dữ liệu thiếu
    if (!ten || !gioi_tinh || !chuc_vu || !phong_ban) {
      return res.status(400).json({ message: "Thiếu thông tin nhân viên" });
    }
    // ⚠️ Kiểm tra phòng ban có tồn tại không (nếu có bảng phongban)
    const checkPB = await pool.query(
      "SELECT * FROM phongban WHERE id=$1",
      [phong_ban]
    );
    if (checkPB.rows.length === 0) {
      return res.status(400).json({ message: "Phòng ban không tồn tại" });
    }

    // ✅ Thêm mới
    const nv = await NhanVien.create({ ten, gioi_tinh, chuc_vu, phong_ban });
    res.status(201).json({ message: "Thêm nhân viên thành công!", data: nv });
  } catch (err) {
    console.error("💥 Lỗi thêm nhân viên:", err);
    if (err.code === "23503") {
      // foreign key error
      return res.status(400).json({ message: "Phòng ban không hợp lệ!" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm nhân viên" });
  }
};

// ✏️ Sửa thông tin nhân viên
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { ten, gioi_tinh, chuc_vu, phong_ban } = req.body;

    // Kiểm tra có tồn tại ID
    const nvOld = await NhanVien.getById(id);
    if (!nvOld) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên để cập nhật" });
    }

    // Kiểm tra phòng ban (nếu có bảng)
    const checkPB = await pool.query("SELECT * FROM phongban WHERE id=$1", [phong_ban]);
    if (checkPB.rows.length === 0) {
      return res.status(400).json({ message: "Phòng ban không tồn tại" });
    }

    const nv = await NhanVien.update(id, { ten, gioi_tinh, chuc_vu, phong_ban });
    res.json({ message: "Cập nhật thành công!", data: nv });
  } catch (err) {
    console.error("💥 Lỗi cập nhật nhân viên:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật nhân viên" });
  }
};

// 🗑️ Xóa nhân viên
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra có tồn tại
    const nv = await NhanVien.getById(id);
    if (!nv) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên để xóa" });
    }

    // Kiểm tra ràng buộc FK (ví dụ có tài khoản gắn với nhân viên)
    const checkTK = await pool.query("SELECT * FROM taikhoan WHERE nhanvien_id=$1", [id]);
    if (checkTK.rows.length > 0) {
      return res.status(400).json({ message: "Không thể xóa vì nhân viên này đã có tài khoản" });
    }

    await NhanVien.delete(id);
    res.json({ message: "Đã xóa nhân viên thành công!" });
  } catch (err) {
    console.error("💥 Lỗi xóa nhân viên:", err);
    if (err.code === "23503") {
      return res.status(400).json({ message: "Không thể xóa do ràng buộc dữ liệu!" });
    }
    res.status(500).json({ message: "Lỗi server khi xóa nhân viên" });
  }
};
