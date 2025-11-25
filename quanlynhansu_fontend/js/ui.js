function initDashboard() {
  requireLogin();
  const user = getUser();
  document.getElementById("user-info").innerText =
    `Tài khoản: ${user.username} (${user.role})`;

  const menu = document.getElementById("menu");

  if (isAdmin()) {
    menu.innerHTML = `
      <a href="nhanvien.html">👨‍💼 Nhân viên</a>
      <a href="phongban.html">🏢 Phòng ban</a>
      <a href="taikhoan.html">🔐 Tài khoản</a>
      <a href="chamcong.html">🕒 Chấm công</a>
      <a href="luong.html">💰 Lương</a>
      <a href="nghiphep.html">📅 Nghỉ phép</a>
    `;
  } else {
    menu.innerHTML = `
      <a href="chamcong.html">🕒 Chấm công</a>
      <a href="luong.html">💰 Lương</a>
      <a href="nghiphep.html">📅 Nghỉ phép</a>
    `;
  }
}
