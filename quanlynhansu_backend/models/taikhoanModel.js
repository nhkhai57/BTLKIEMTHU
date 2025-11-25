const pool = require("../db/pool");

const TaiKhoan = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM taikhoan ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM taikhoan WHERE id=$1", [id]);
    return result.rows[0];
  },

  findByUsername: async (username) => {
    const result = await pool.query("SELECT * FROM taikhoan WHERE username=$1", [username]);
    return result.rows[0];
  },

  checkNhanVienExist: async (nhanvien_id) => {
    const result = await pool.query("SELECT * FROM nhanvien WHERE id=$1", [nhanvien_id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { username, password, role, nhanvien_id } = data;
    const result = await pool.query(
      "INSERT INTO taikhoan (username, password, role, nhanvien_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, role, nhanvien_id]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { username, role } = data;
    const result = await pool.query(
      "UPDATE taikhoan SET username=$1, role=$2 WHERE id=$3 RETURNING *",
      [username, role, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM taikhoan WHERE id=$1", [id]);
  },

  login: async (username, password) => {
    const result = await pool.query(
      "SELECT * FROM taikhoan WHERE username=$1 AND password=$2",
      [username, password]
    );
    return result.rows[0];
  },
};

module.exports = TaiKhoan;
