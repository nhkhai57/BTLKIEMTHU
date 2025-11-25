const TaiKhoan = require("../models/taikhoanModel");

/**
 * 📋 LẤY TẤT CẢ TÀI KHOẢN
 */
exports.getAll = async (req, res) => {
  try {
    // ✅ Trả luôn cả mật khẩu (chỉ dùng cho dev/test)
    const data = await TaiKhoan.getAll();
    res.json(data);
  } catch (err) {
    console.error("💥 Lỗi khi lấy danh sách tài khoản:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách tài khoản" });
  }
};


/**
 * 🔍 LẤY TÀI KHOẢN THEO ID
 */
exports.getById = async (req, res) => {
  try {
    const tk = await TaiKhoan.getById(req.params.id);
    if (!tk) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }
    res.json(tk);
  } catch (error) {
    console.error("💥 Lỗi truy vấn tài khoản:", error);
    res.status(500).json({ message: "Lỗi server khi truy vấn tài khoản!" });
  }
};

/**
 * ➕ THÊM TÀI KHOẢN
 */
exports.create = async (req, res) => {
  try {
    const { username, password, role, nhanvien_id } = req.body;

    // === 1️⃣ Kiểm tra thiếu thông tin ===
    if (!username || !password || !role || !nhanvien_id) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // === 2️⃣ Kiểm tra username trùng ===
    const exist = await TaiKhoan.findByUsername(username);
    if (exist) {
      return res.status(409).json({ message: "Tên đăng nhập đã tồn tại!" });
    }

    // === 3️⃣ Kiểm tra mã nhân viên tồn tại ===
    const nv = await TaiKhoan.checkNhanVienExist(nhanvien_id);
    if (!nv) {
      return res.status(400).json({ message: "Mã nhân viên không tồn tại!" });
    }

    // === 4️⃣ Thêm tài khoản ===
    const tk = await TaiKhoan.create({ username, password, role, nhanvien_id });
    res.status(201).json({ message: "Tạo tài khoản thành công!", data: tk });
  } catch (error) {
    console.error("💥 Lỗi thêm tài khoản:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Tên đăng nhập đã tồn tại (UNIQUE)!" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ message: "Mã nhân viên không hợp lệ (FOREIGN KEY)!" });
    }
    if (error.code === "22P02") {
      return res.status(400).json({ message: "Kiểu dữ liệu không hợp lệ!" });
    }

    res.status(500).json({ message: "Lỗi server nội bộ khi thêm tài khoản!" });
  }
};

/**
 * ✏️ CẬP NHẬT TÀI KHOẢN
 */
exports.update = async (req, res) => {
  try {
    const { username, role } = req.body;
    const id = req.params.id;

    // === 1️⃣ Kiểm tra dữ liệu rỗng ===
    if (!username || !role) {
      return res.status(400).json({ message: "Thiếu thông tin cập nhật!" });
    }

    // === 2️⃣ Kiểm tra tài khoản tồn tại ===
    const exist = await TaiKhoan.getById(id);
    if (!exist) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản cần cập nhật!" });
    }

    // === 3️⃣ Kiểm tra username trùng với người khác ===
    const dup = await TaiKhoan.findByUsername(username);
    if (dup && dup.id != id) {
      return res.status(409).json({ message: "Tên đăng nhập đã được sử dụng bởi tài khoản khác!" });
    }

    // === 4️⃣ Cập nhật tài khoản ===
    const updated = await TaiKhoan.update(id, { username, role });
    res.json({ message: "Cập nhật tài khoản thành công!", data: updated });
  } catch (error) {
    console.error("💥 Lỗi cập nhật tài khoản:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Tên đăng nhập bị trùng!" });
    }

    res.status(500).json({ message: "Lỗi server nội bộ khi cập nhật tài khoản!" });
  }
};

/**
 * ❌ XOÁ TÀI KHOẢN
 */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // === 1️⃣ Kiểm tra tồn tại ===
    const exist = await TaiKhoan.getById(id);
    if (!exist) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản cần xoá!" });
    }

    // === 2️⃣ Thực hiện xoá ===
    await TaiKhoan.delete(id);
    res.json({ message: "Đã xoá tài khoản thành công!" });
  } catch (error) {
    console.error("💥 Lỗi xoá tài khoản:", error);

    // === Bắt lỗi khoá ngoại (nếu tài khoản đang liên kết dữ liệu khác) ===
    if (error.code === "23503") {
      return res.status(400).json({ message: "Không thể xoá tài khoản do đang được liên kết!" });
    }

    res.status(500).json({ message: "Lỗi server nội bộ khi xoá tài khoản!" });
  }
};

/**
 * 🔐 ĐĂNG NHẬP
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await TaiKhoan.login(username, password);

    if (!user) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    res.json(user);
  } catch (error) {
    console.error("💥 Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};
