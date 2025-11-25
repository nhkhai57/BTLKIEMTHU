const pool = require("../db/pool");

exports.getThongKeTongQuat = async (req, res) => {
  try {
    // === 1. Tổng số nhân viên ===
    const nv = await pool.query("SELECT COUNT(*) AS tong_nv FROM nhanvien");

    // === 2. Số lượt chấm công hôm nay ===
    const cc = await pool.query(`
      SELECT COUNT(*) AS so_luot
      FROM chamcong
      WHERE DATE(ngay) = CURRENT_DATE
    `);

    // === 3. Thống kê đơn nghỉ phép ===
    const np = await pool.query(`
      SELECT 
        SUM(CASE WHEN trang_thai = 'Chờ duyệt' THEN 1 ELSE 0 END) AS cho_duyet,
        SUM(CASE WHEN trang_thai = 'Đã duyệt' THEN 1 ELSE 0 END) AS da_duyet,
        SUM(CASE WHEN trang_thai = 'Từ chối' THEN 1 ELSE 0 END) AS tu_choi
      FROM nghiphep
    `);

    // === 4. Biểu đồ chấm công 7 ngày gần nhất ===
    const cc7ngay = await pool.query(`
      SELECT TO_CHAR(ngay, 'DD/MM') AS ngay, COUNT(*) AS so_luot
      FROM chamcong
      WHERE ngay >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY ngay
      ORDER BY ngay ASC
    `);

    res.json({
      tong_nv: parseInt(nv.rows[0].tong_nv) || 0,
      chamcong_hom_nay: parseInt(cc.rows[0].so_luot) || 0,
      don_cho_duyet: parseInt(np.rows[0].cho_duyet) || 0,
      don_da_duyet: parseInt(np.rows[0].da_duyet) || 0,
      don_tu_choi: parseInt(np.rows[0].tu_choi) || 0,
      chamcong_7ngay: cc7ngay.rows,
    });

  } catch (err) {
    console.error("💥 Lỗi thống kê:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
};
