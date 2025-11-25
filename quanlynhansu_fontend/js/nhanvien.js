let editId = null;

async function loadNhanVien() {
  try {
    const data = await apiGet("nhanvien");
    renderNhanVien(data);
  } catch {
    showMessage("error", "❌ Không thể tải danh sách nhân viên!");
  }
}

function renderNhanVien(data) {
  const tbody = document.querySelector("#nhanvienTable tbody");
  tbody.innerHTML = "";

  data.forEach((nv) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nv.id}</td>
      <td>${nv.ten}</td>
      <td>${nv.gioi_tinh}</td>
      <td>${nv.chuc_vu}</td>
      <td>${nv.phong_ban}</td>
      <td>
        <button class="edit" onclick="editNhanVien(${nv.id}, '${nv.ten}', '${nv.gioi_tinh}', '${nv.chuc_vu}', '${nv.phong_ban}')">✏️</button>
        <button class="delete" onclick="deleteNhanVien(${nv.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveNhanVien() {
  const ten = document.getElementById("tenNV").value.trim();
  const gioi_tinh = document.getElementById("gioitinh").value;
  const chuc_vu = document.getElementById("chucvu").value.trim();
  const phong_ban = document.getElementById("phongban").value.trim();

  if (!ten || !gioi_tinh || !chuc_vu || !phong_ban) {
    showMessage("error", "⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const data = { ten, gioi_tinh, chuc_vu, phong_ban };

  try {
    let res;
    if (editId) {
      res = await apiPut(`nhanvien/${editId}`, data);
      showMessage("success", res.message || "✅ Cập nhật nhân viên thành công!");
      editId = null;
    } else {
      res = await apiPost("nhanvien", data);
      showMessage("success", res.message || "✅ Thêm nhân viên thành công!");
    }

    document.querySelectorAll("input").forEach((i) => (i.value = ""));
    document.getElementById("gioitinh").value = "";
    loadNhanVien();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi khi lưu nhân viên!");
  }
}

function editNhanVien(id, ten, gioi_tinh, chuc_vu, phong_ban) {
  editId = id;
  document.getElementById("tenNV").value = ten;
  document.getElementById("gioitinh").value = gioi_tinh;
  document.getElementById("chucvu").value = chuc_vu;
  document.getElementById("phongban").value = phong_ban;
  showMessage("info", "✏️ Đang chỉnh sửa nhân viên ID " + id);
}

async function deleteNhanVien(id) {
  if (confirm("Bạn có chắc muốn xoá nhân viên này không?")) {
    try {
      const res = await apiDelete(`nhanvien/${id}`);
      showMessage("success", res.message || "🗑️ Đã xoá nhân viên!");
      loadNhanVien();
    } catch (err) {
      showMessage("error", err.message || "❌ Lỗi khi xoá nhân viên!");
    }
  }
}

async function searchNhanVien() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("nhanvien");
  const filtered = all.filter(
    (nv) =>
      nv.ten.toLowerCase().includes(keyword) ||
      nv.chuc_vu.toLowerCase().includes(keyword)
  );
  renderNhanVien(filtered);
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}
