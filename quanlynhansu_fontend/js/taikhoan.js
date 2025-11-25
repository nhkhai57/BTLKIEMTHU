let editId = null;

async function loadTaiKhoan() {
  try {
    const data = await apiGet("taikhoan");
    renderTaiKhoan(data);
  } catch {
    showMessage("error", "❌ Không thể tải danh sách tài khoản!");
  }
}

function renderTaiKhoan(data) {
  const tbody = document.getElementById("tbody-tk");
  tbody.innerHTML = "";

  data.forEach(tk => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tk.id}</td>
      <td>${tk.username}</td>
      <td>${tk.password || "(ẩn)"}</td>
      <td>${tk.role}</td>
      <td>${tk.nhanvien_id}</td>
      <td>
        <button class="edit" onclick="editTaiKhoan(${tk.id}, '${tk.username}', '${tk.role}', ${tk.nhanvien_id})">✏️</button>
        <button class="delete" onclick="xoaTK(${tk.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveTaiKhoan() {
  const usernameVal = document.getElementById("username").value.trim();
  const passwordVal = document.getElementById("password").value.trim();
  const roleVal = document.getElementById("role").value.trim();
  const nhanvienIdVal = document.getElementById("nhanvien_id").value.trim();

  if (!usernameVal || !passwordVal || !roleVal || !nhanvienIdVal) {
    showMessage("error", "⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const data = {
    username: usernameVal,
    password: passwordVal,
    role: roleVal,
    nhanvien_id: nhanvienIdVal
  };

  try {
    let res;
    if (editId) {
      res = await apiPut(`taikhoan/${editId}`, data);
      showMessage("success", res.message || "✅ Cập nhật tài khoản thành công!");
      editId = null;
    } else {
      res = await apiPost("taikhoan", data);
      showMessage("success", res.message || "✅ Thêm tài khoản thành công!");
    }

    clearForm();
    loadTaiKhoan();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi khi lưu tài khoản!");
  }
}

function editTaiKhoan(id, username, role, nhanvien_id) {
  editId = id;
  document.getElementById("username").value = username;
  document.getElementById("password").value = "";
  document.getElementById("role").value = role;
  document.getElementById("nhanvien_id").value = nhanvien_id;
  showMessage("info", "✏️ Đang chỉnh sửa tài khoản ID " + id);
}

async function xoaTK(id) {
  if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
    try {
      const res = await apiDelete(`taikhoan/${id}`);
      showMessage("success", res.message || "🗑️ Đã xóa tài khoản!");
      loadTaiKhoan();
    } catch (err) {
      showMessage("error", err.message || "❌ Lỗi khi xóa tài khoản!");
    }
  }
}

async function searchTaiKhoan() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("taikhoan");
  const filtered = all.filter(
    tk =>
      tk.username.toLowerCase().includes(keyword) ||
      tk.role.toLowerCase().includes(keyword)
  );
  renderTaiKhoan(filtered);
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}

function clearForm() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  document.getElementById("role").value = "";
}
