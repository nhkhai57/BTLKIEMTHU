const ChamCong = require("../models/chamcongModel");
const pool = require("../db/pool");

// 📋 Lấy tất cả bản ghi chấm công
exports.getAll = async (req, res) => {
  try {
    const data = await ChamCong.getAll();
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi lấy danh sách chấm công:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách chấm công" });
  }
};

// ➕ Thêm bản ghi chấm công (Admin hoặc nhân viên check-in)
exports.create = async (req, res) => {
  try {
    const { nhanvien_id, ngay, gio_vao, gio_ra, trang_thai } = req.body;

    if (!nhanvien_id || !ngay || !gio_vao) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc (nhanvien_id, ngay, gio_vao)" });
    }

    // ⚠️ Kiểm tra nhân viên tồn tại
    const checkNV = await pool.query("SELECT * FROM nhanvien WHERE id=$1", [nhanvien_id]);
    if (checkNV.rows.length === 0) {
      return res.status(400).json({ message: "Nhân viên không tồn tại" });
    }

    // ⚠️ Kiểm tra trùng ngày (để tránh nhân viên chấm công 2 lần)
    const check = await pool.query(
      "SELECT * FROM chamcong WHERE nhanvien_id=$1 AND ngay=$2",
      [nhanvien_id, ngay]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Hôm nay bạn đã chấm công vào rồi!" });
    }

    // ✅ Thêm bản ghi mới (chưa có giờ ra)
    const cc = await ChamCong.create({
      nhanvien_id,
      ngay,
      gio_vao,
      gio_ra: gio_ra || null,
      trang_thai: trang_thai || "Đang làm việc",
    });

    res.status(201).json({ message: "Chấm công vào thành công!", data: cc });
  } catch (err) {
    console.error("💥 Lỗi thêm chấm công:", err);
    res.status(500).json({ message: "Lỗi server khi thêm chấm công" });
  }
};

// ✏️ Cập nhật bản ghi chấm công (nhân viên check-out hoặc admin chỉnh sửa)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { gio_vao, gio_ra, trang_thai } = req.body;

    const ccOld = await ChamCong.getById(id);
    if (!ccOld) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi chấm công để cập nhật" });
    }

    // Nếu nhân viên check-out (chưa có gio_ra trước đó)
    const updated = await ChamCong.update(id, {
      gio_vao: gio_vao || ccOld.gio_vao,
      gio_ra: gio_ra || new Date().toLocaleTimeString(),
      trang_thai: trang_thai || "Hoàn thành",
    });

    res.json({ message: "Cập nhật chấm công thành công!", data: updated });
  } catch (err) {
    console.error("💥 Lỗi cập nhật chấm công:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật chấm công" });
  }
};

// 🗑️ Xóa bản ghi chấm công
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const cc = await ChamCong.getById(id);

    if (!cc) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi chấm công để xóa" });
    }

    await ChamCong.delete(id);
    res.json({ message: "Đã xóa bản ghi chấm công thành công!" });
  } catch (err) {
    console.error("💥 Lỗi xóa chấm công:", err);
    res.status(500).json({ message: "Lỗi server khi xóa chấm công" });
  }
};
