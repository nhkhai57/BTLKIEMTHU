const pool = require("../db/pool");

const NhanVien = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM nhanvien ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM nhanvien WHERE id=$1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { ten, gioi_tinh, chuc_vu, phong_ban } = data;
    const result = await pool.query(
      "INSERT INTO nhanvien (ten, gioi_tinh, chuc_vu, phong_ban) VALUES ($1,$2,$3,$4) RETURNING *",
      [ten, gioi_tinh, chuc_vu, phong_ban]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { ten, gioi_tinh, chuc_vu, phong_ban } = data;
    const result = await pool.query(
      "UPDATE nhanvien SET ten=$1, gioi_tinh=$2, chuc_vu=$3, phong_ban=$4 WHERE id=$5 RETURNING *",
      [ten, gioi_tinh, chuc_vu, phong_ban, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM nhanvien WHERE id=$1", [id]);
  },
};

module.exports = NhanVien;
