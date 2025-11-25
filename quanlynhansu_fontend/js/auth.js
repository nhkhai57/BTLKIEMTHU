// ==== Lưu / Lấy / Xóa user ====

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

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

  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }

  window.location.replace("login.html");
}

// ==== Kiểm tra login cơ bản ====

function requireLogin() {
  const user = getUser();
  if (!user) {
    window.location.replace("login.html");
  }
}

// ==== Phân quyền theo vai trò ====

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.replace("dashboard_nv.html");
  }
}

function requireNhanVien() {
  const user = getUser();
  if (!user || user.role !== "nhanvien") {
    alert("Trang này chỉ dành cho nhân viên!");
    window.location.replace("index.html");
  }
}
