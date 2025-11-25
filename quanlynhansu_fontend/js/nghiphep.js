let editId = null;

// ========================== LOAD DANH SÁCH ==========================
async function loadNghiPhep() {
  try {
    const data = await apiGet("nghiphep");
    console.log("📦 Dữ liệu nghỉ phép:", data);
    renderNghiPhep(data);
  } catch (err) {
    console.error("💥 Lỗi FE loadNghiPhep:", err);
    showMessage("error", "❌ Lỗi tải danh sách đơn nghỉ phép!");
  }
}

// ========================== HIỂN THỊ DỮ LIỆU ==========================
function renderNghiPhep(data) {
  const tbody = document.getElementById("tbody-np");
  tbody.innerHTML = "";

  const user = getUser();
  const role = user?.role || user?.vai_tro || user?.chucvu || "";

  data.forEach(np => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${np.id}</td>
      <td>${np.nhanvien_id}</td>
      <td>${formatDate(np.tu_ngay)}</td>
      <td>${formatDate(np.den_ngay)}</td>
      <td>${np.ly_do}</td>
      <td>
        <span class="status ${np.trang_thai.toLowerCase().replace(" ", "-")}">${np.trang_thai}</span>
      </td>
      <td>
        ${
          role.toLowerCase() === "admin"
            ? `
              <button class="approve" onclick="duyetNP(${np.id}, 'Đã duyệt')">✅</button>
              <button class="reject" onclick="duyetNP(${np.id}, 'Từ chối')">❌</button>
              <button class="delete" onclick="xoaNP(${np.id})">🗑️</button>
            `
            : `
              <button class="delete" onclick="xoaNP(${np.id})">🗑️</button>
            `
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// ========================== THÊM / GỬI ĐƠN ==========================
async function saveNghiPhep() {
  const nhanvien_id = document.getElementById("nhanvien_id").value.trim();
  const tu_ngay = document.getElementById("tu_ngay").value.trim();
  const den_ngay = document.getElementById("den_ngay").value.trim();
  const ly_do = document.getElementById("ly_do").value.trim();
  const trang_thai = document.getElementById("trang_thai").value.trim();

  if (!nhanvien_id || !tu_ngay || !den_ngay || !ly_do) {
    showMessage("error", "⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (new Date(tu_ngay) > new Date(den_ngay)) {
    showMessage("error", "⚠️ Từ ngày phải nhỏ hơn hoặc bằng Đến ngày!");
    return;
  }

  try {
    const res = await apiPost("nghiphep", {
      nhanvien_id,
      tu_ngay,
      den_ngay,
      ly_do,
      trang_thai
    });
    showMessage("success", res.message || "✅ Gửi đơn nghỉ phép thành công!");
    clearForm();
    loadNghiPhep();
  } catch (err) {
    showMessage("error", err.message || "❌ Lỗi gửi đơn nghỉ phép!");
  }
}

// ========================== DUYỆT / TỪ CHỐI ==========================
async function duyetNP(id, status) {
  if (confirm(`Bạn có chắc muốn đổi trạng thái đơn này thành "${status}"?`)) {
    try {
      const res = await apiPut(`nghiphep/${id}`, { trang_thai: status });
      showMessage("success", res.message || `✅ Đơn đã được ${status.toLowerCase()}!`);
      loadNghiPhep();
    } catch {
      showMessage("error", "❌ Lỗi khi cập nhật trạng thái đơn nghỉ phép!");
    }
  }
}

// ========================== XOÁ ĐƠN ==========================
async function xoaNP(id) {
  if (confirm("Xóa đơn nghỉ phép này?")) {
    try {
      const res = await apiDelete(`nghiphep/${id}`);
      showMessage("success", res.message || "🗑️ Đã xóa đơn nghỉ phép!");
      loadNghiPhep();
    } catch {
      showMessage("error", "❌ Lỗi khi xóa đơn nghỉ phép!");
    }
  }
}

// ========================== TÌM KIẾM ==========================
async function searchNghiPhep() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const all = await apiGet("nghiphep");
  const filtered = all.filter(
    np =>
      np.nhanvien_id.toString().includes(keyword) ||
      np.trang_thai.toLowerCase().includes(keyword)
  );
  renderNghiPhep(filtered);
}

// ========================== HỖ TRỢ ==========================
function clearForm() {
  document.querySelectorAll("input, select").forEach(el => (el.value = ""));
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `msg ${type}`;
  msg.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

// ========================== QUẢN LÝ USER & ROLE ==========================
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  if ("caches" in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
  window.location.replace("login.html");
}

function requireAdmin() {
  const user = getUser();
  const role = user?.role || user?.vai_tro || user?.chucvu || "";
  if (role.toLowerCase() !== "admin") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.replace("dashboard_nv.html");
  }
}

function isAdmin() {
  const user = getUser();
  const role = user?.role || user?.vai_tro || user?.chucvu || "";
  return role.toLowerCase() === "admin";
}


function isAdmin() {
  const user = getUser();
  return user && user.vai_tro?.toLowerCase() === "admin";
}
