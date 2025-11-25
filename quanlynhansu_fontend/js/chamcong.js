let editId = null;

async function loadChamCong() {
  try {
    const data = await apiGet("chamcong");
    renderChamCong(data);
  } catch (err) {
    showMessage("error", "❌ Lỗi tải danh sách chấm công!");
  }
}

function renderChamCong(data) {
  const tbody = document.getElementById("tbody-cc");
  tbody.innerHTML = "";
  data.forEach(cc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cc.id}</td>
      <td>${cc.nhanvien_id}</td>
      <td>${cc.ngay}</td>
      <td>${cc.gio_vao}</td>
      <td>${cc.gio_ra || ""}</td>
      <td>${cc.trang_thai}</td>
      <td>
        <button class="edit" onclick="editChamCong(${cc.id}, ${cc.nhanvien_id}, '${cc.ngay}', '${cc.gio_vao}', '${cc.gio_ra || ""}', '${cc.trang_thai || ""}')">✏️</button>
        <button class="delete" onclick="xoaChamCong(${cc.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveChamCong() {
  const nhanvien_id = document.getElementById("nhanvien_id").value.trim();
  const ngay = document.getElementById("ngay").value.trim();
  const gio_vao = document.getElementById("gio_vao").value.trim();
  const gio_ra = document.getElementById("gio_ra").value.trim();
  const trang_thai = document.getElementById("trang_thai").value.trim();

  if (!nhanvien_id || !ngay || !gio_vao || !trang_thai) {
    showMessage("error", "⚠️ Vui lòng nhập đủ thông tin bắt buộc!");
    return;
  }

  const data = { nhanvien_id, ngay, gio_vao, gio_ra, trang_thai };

  try {
    let res;
    if (editId) {
      res = await apiPut(`chamcong/${editId}`, data);
      showMessage("success", res.message || "✅ Cập nhật chấm công thành công!");
      editId = null;
    } else {
      res = await apiPost("chamcong", data);
      showMessage("success", res.message || "✅ Thêm chấm công thành công!");
    }

    clearForm();
    loadChamCong();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi khi lưu chấm công!");
  }
}

function editChamCong(id, nhanvien_id, ngay, gio_vao, gio_ra, trang_thai) {
  editId = id;
  document.getElementById("nhanvien_id").value = nhanvien_id;
  document.getElementById("ngay").value = ngay;
  document.getElementById("gio_vao").value = gio_vao;
  document.getElementById("gio_ra").value = gio_ra;
  document.getElementById("trang_thai").value = trang_thai;
  showMessage("info", `✏️ Đang chỉnh sửa bản ghi ID ${id}`);
}

async function xoaChamCong(id) {
  if (confirm("Bạn có chắc muốn xóa bản ghi chấm công này không?")) {
    try {
      const res = await apiDelete(`chamcong/${id}`);
      showMessage("success", res.message || "🗑️ Đã xóa bản ghi!");
      loadChamCong();
    } catch (err) {
      showMessage("error", err.message || "❌ Lỗi khi xóa chấm công!");
    }
  }
}

async function searchChamCong() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("chamcong");
  const filtered = all.filter(cc =>
    cc.nhanvien_id.toString().includes(keyword) || cc.ngay.includes(keyword)
  );
  renderChamCong(filtered);
}

function clearForm() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}
