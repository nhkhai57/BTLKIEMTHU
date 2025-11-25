const pool = require("../db/pool");

const ChamCong = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM chamcong ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM chamcong WHERE id=$1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nhanvien_id, ngay, gio_vao, gio_ra, trang_thai } = data;
    const result = await pool.query(
      "INSERT INTO chamcong (nhanvien_id, ngay, gio_vao, gio_ra, trang_thai) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nhanvien_id, ngay, gio_vao, gio_ra, trang_thai]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { gio_vao, gio_ra, trang_thai } = data;
    const result = await pool.query(
      "UPDATE chamcong SET gio_vao=$1, gio_ra=$2, trang_thai=$3 WHERE id=$4 RETURNING *",
      [gio_vao, gio_ra, trang_thai, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM chamcong WHERE id=$1", [id]);
  },
};

module.exports = ChamCong;
