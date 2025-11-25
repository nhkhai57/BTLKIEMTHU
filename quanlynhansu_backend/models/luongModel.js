const pool = require("../db/pool");

const Luong = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM luong ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM luong WHERE id=$1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong } = data;
    const result = await pool.query(
      `INSERT INTO luong (nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { luong_co_ban, phu_cap, khau_tru, tong_luong } = data;
    const result = await pool.query(
      `UPDATE luong SET luong_co_ban=$1, phu_cap=$2, khau_tru=$3, tong_luong=$4 
       WHERE id=$5 RETURNING *`,
      [luong_co_ban, phu_cap, khau_tru, tong_luong, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM luong WHERE id=$1", [id]);
  },
};

module.exports = Luong;
