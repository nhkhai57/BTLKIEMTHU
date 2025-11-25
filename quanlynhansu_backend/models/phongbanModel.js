const pool = require("../db/pool");

const PhongBan = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM phongban ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM phongban WHERE id=$1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { tenphong } = data;
    const result = await pool.query(
      "INSERT INTO phongban (tenphong) VALUES ($1) RETURNING *",
      [tenphong]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { tenphong } = data;
    const result = await pool.query(
      "UPDATE phongban SET tenphong=$1 WHERE id=$2 RETURNING *",
      [tenphong, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM phongban WHERE id=$1", [id]);
  },
};

module.exports = PhongBan;
