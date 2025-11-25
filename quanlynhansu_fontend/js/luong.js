let editId = null;

async function loadLuong() {
  try {
    const data = await apiGet("luong");
    renderLuong(data);
  } catch (err) {
    showMessage("error", "❌ Lỗi tải danh sách bảng lương!");
  }
}

function renderLuong(data) {
  const tbody = document.getElementById("tbody-luong");
  tbody.innerHTML = "";
  data.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.id}</td>
      <td>${l.nhanvien_id}</td>
      <td>${l.thang}</td>
      <td>${l.luong_co_ban}</td>
      <td>${l.phu_cap || 0}</td>
      <td>${l.khau_tru || 0}</td>
      <td>${l.tong_luong}</td>
      <td>
        <button class="edit" onclick="editLuong(${l.id}, ${l.nhanvien_id}, '${l.thang}', ${l.luong_co_ban}, ${l.phu_cap || 0}, ${l.khau_tru || 0}, ${l.tong_luong})">✏️</button>
        <button class="delete" onclick="xoaLuong(${l.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveLuong() {
  const nhanvien_id = document.getElementById("nhanvien_id").value.trim();
  const thang = document.getElementById("thang").value.trim();
  const luong_co_ban = Number(document.getElementById("luong_co_ban").value.trim());
  const phu_cap = Number(document.getElementById("phu_cap").value.trim()) || 0;
  const khau_tru = Number(document.getElementById("khau_tru").value.trim()) || 0;
  const tong_luong = luong_co_ban + phu_cap - khau_tru;

  // Kiểm tra nhập liệu cơ bản
  if (!nhanvien_id || !thang || !luong_co_ban) {
    showMessage("error", "⚠️ Vui lòng nhập đủ ID nhân viên, tháng và lương cơ bản!");
    return;
  }

  const data = { nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong };

  try {
    let res;
    if (editId) {
      res = await apiPut(`luong/${editId}`, data);
      showMessage("success", res.message || "✅ Cập nhật lương thành công!");
      editId = null;
    } else {
      res = await apiPost("luong", data);
      showMessage("success", res.message || "✅ Thêm bản lương thành công!");
    }

    clearForm();
    loadLuong();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi khi lưu bảng lương!");
  }
}

function editLuong(id, nhanvien_id, thang, luong_co_ban, phu_cap, khau_tru, tong_luong) {
  editId = id;
  document.getElementById("nhanvien_id").value = nhanvien_id;
  document.getElementById("thang").value = thang;
  document.getElementById("luong_co_ban").value = luong_co_ban;
  document.getElementById("phu_cap").value = phu_cap;
  document.getElementById("khau_tru").value = khau_tru;
  document.getElementById("tong_luong").value = tong_luong;
  showMessage("info", `✏️ Đang chỉnh sửa bản lương ID ${id}`);
}

async function xoaLuong(id) {
  if (confirm("Bạn có chắc muốn xóa bản lương này không?")) {
    try {
      const res = await apiDelete(`luong/${id}`);
      showMessage("success", res.message || "🗑️ Đã xóa bản lương!");
      loadLuong();
    } catch (err) {
      showMessage("error", err.message || "❌ Lỗi khi xóa lương!");
    }
  }
}

async function searchLuong() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("luong");
  const filtered = all.filter(
    l =>
      l.nhanvien_id.toString().includes(keyword) ||
      l.thang.toLowerCase().includes(keyword)
  );
  renderLuong(filtered);
}

function clearForm() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  document.getElementById("tong_luong").value = "";
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}

// Tự tính tổng lương khi nhập
["luong_co_ban", "phu_cap", "khau_tru"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    const base = Number(document.getElementById("luong_co_ban").value) || 0;
    const pc = Number(document.getElementById("phu_cap").value) || 0;
    const kt = Number(document.getElementById("khau_tru").value) || 0;
    document.getElementById("tong_luong").value = base + pc - kt;
  });
});
