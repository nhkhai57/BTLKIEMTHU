const pool = require("../db/pool");

const NghiPhep = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM nghiphep ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM nghiphep WHERE id=$1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nhanvien_id, tu_ngay, den_ngay, ly_do, trang_thai } = data;
    const result = await pool.query(
      `INSERT INTO nghiphep (nhanvien_id, tu_ngay, den_ngay, ly_do, trang_thai)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nhanvien_id, tu_ngay, den_ngay, ly_do, trang_thai]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { trang_thai } = data;
    const result = await pool.query(
      `UPDATE nghiphep SET trang_thai=$1 WHERE id=$2 RETURNING *`,
      [trang_thai, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM nghiphep WHERE id=$1", [id]);
  },
};

module.exports = NghiPhep;
