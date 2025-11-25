let editId = null;

async function loadPhongBan() {
  try {
    const data = await apiGet("phongban");
    renderPhongBan(data);
  } catch {
    showMessage("error", "❌ Không thể tải danh sách phòng ban!");
  }
}

function renderPhongBan(data) {
  const tbody = document.getElementById("tbody-pb");
  tbody.innerHTML = "";
  data.forEach(pb => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pb.id}</td>
      <td>${pb.tenphong}</td>
      <td>
        <button class="edit" onclick="editPhongBan(${pb.id}, '${pb.tenphong}')">✏️</button>
        <button class="delete" onclick="xoaPB(${pb.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function savePhongBan() {
  const tenphong = document.getElementById("tenphong").value.trim();

  if (!tenphong) {
    showMessage("error", "⚠️ Vui lòng nhập tên phòng ban!");
    return;
  }

  const data = { tenphong };

  try {
    let res;
    if (editId) {
      res = await apiPut(`phongban/${editId}`, data);
      showMessage("success", res.message || "✅ Cập nhật phòng ban thành công!");
      editId = null;
    } else {
      res = await apiPost("phongban", data);
      showMessage("success", res.message || "✅ Thêm phòng ban thành công!");
    }

    document.getElementById("tenphong").value = "";
    loadPhongBan();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi khi lưu phòng ban!");
  }
}

function editPhongBan(id, tenphong) {
  editId = id;
  document.getElementById("tenphong").value = tenphong;
  showMessage("info", "✏️ Đang chỉnh sửa phòng ban ID " + id);
}

async function xoaPB(id) {
  if (confirm("Bạn có chắc muốn xóa phòng ban này không?")) {
    try {
      const res = await apiDelete(`phongban/${id}`);
      showMessage("success", res.message || "🗑️ Đã xóa phòng ban!");
      loadPhongBan();
    } catch (err) {
      showMessage("error", err.message || "❌ Lỗi khi xóa phòng ban!");
    }
  }
}

async function searchPhongBan() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("phongban");
  const filtered = all.filter(pb => pb.tenphong.toLowerCase().includes(keyword));
  renderPhongBan(filtered);
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}
