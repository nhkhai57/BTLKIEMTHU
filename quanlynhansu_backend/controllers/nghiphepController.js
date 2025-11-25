const NghiPhep = require("../models/nghiphepModel");
const pool = require("../db/pool");

// 📋 Lấy danh sách nghỉ phép
exports.getAll = async (req, res) => {
  try {
    const data = await NghiPhep.getAll();
    console.log("✅ Nghỉ phép data:", data);
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi lấy danh sách nghỉ phép:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách đơn nghỉ phép", detail: err.message });
  }
};


// ➕ Tạo đơn nghỉ phép
exports.create = async (req, res) => {
  try {
    const { nhanvien_id, tu_ngay, den_ngay, ly_do, trang_thai } = req.body;

    // ⚠️ Kiểm tra thông tin bắt buộc
    if (!nhanvien_id || !tu_ngay || !den_ngay || !ly_do) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc (nhân viên, từ ngày, đến ngày, lý do)" });
    }

    // ⚠️ Kiểm tra nhân viên tồn tại
    const checkNV = await pool.query("SELECT * FROM nhanvien WHERE id=$1", [nhanvien_id]);
    if (checkNV.rows.length === 0) {
      return res.status(400).json({ message: "Mã nhân viên không tồn tại" });
    }

    // ⚠️ Kiểm tra ngày nghỉ hợp lệ
    const start = new Date(tu_ngay);
    const end = new Date(den_ngay);
    if (isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ message: "Khoảng thời gian không hợp lệ (từ ngày phải nhỏ hơn đến ngày)" });
    }

    // ⚠️ Kiểm tra trùng khoảng nghỉ
    const trungs = await pool.query(
      `SELECT * FROM nghiphep 
       WHERE nhanvien_id=$1 AND (
         (tu_ngay <= $2 AND den_ngay >= $2) OR 
         (tu_ngay <= $3 AND den_ngay >= $3)
       )`,
      [nhanvien_id, tu_ngay, den_ngay]
    );
    if (trungs.rows.length > 0) {
      return res.status(400).json({ message: "Nhân viên này đã có đơn nghỉ trùng thời gian" });
    }

    const np = await NghiPhep.create({
      nhanvien_id,
      tu_ngay,
      den_ngay,
      ly_do,
      trang_thai: trang_thai || "Chờ duyệt",
    });

    res.status(201).json({ message: "✅ Thêm đơn nghỉ phép thành công!", data: np });
  } catch (err) {
    console.error("💥 Lỗi thêm đơn nghỉ phép:", err);
    if (err.code === "23503") {
      return res.status(400).json({ message: "Mã nhân viên không hợp lệ (FK constraint)" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm đơn nghỉ phép" });
  }
};

// ✏️ Duyệt hoặc cập nhật trạng thái đơn
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { trang_thai } = req.body;

    const np = await NghiPhep.getById(id);
    if (!np) {
      return res.status(404).json({ message: "Không tìm thấy đơn nghỉ phép để duyệt" });
    }

    if (!["Chờ duyệt", "Đã duyệt", "Từ chối"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ (chỉ chấp nhận: Chờ duyệt, Đã duyệt, Từ chối)" });
    }

    const updated = await NghiPhep.update(id, { trang_thai });
    res.json({ message: "✅ Cập nhật trạng thái đơn nghỉ thành công!", data: updated });
  } catch (err) {
    console.error("💥 Lỗi cập nhật nghỉ phép:", err);
    res.status(500).json({ message: "Lỗi server khi duyệt đơn nghỉ phép" });
  }
};

// 🗑️ Xóa đơn nghỉ phép
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const np = await NghiPhep.getById(id);
    if (!np) {
      return res.status(404).json({ message: "Không tìm thấy đơn nghỉ phép để xóa" });
    }

    await NghiPhep.delete(id);
    res.json({ message: "🗑️ Đã xóa đơn nghỉ phép thành công!" });
  } catch (err) {
    console.error("💥 Lỗi xóa nghỉ phép:", err);
    res.status(500).json({ message: "Lỗi server khi xóa đơn nghỉ phép" });
  }
};
