async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!username || !password) {
    msg.innerText = "Vui lòng nhập đầy đủ thông tin!";
    msg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/taikhoan/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      msg.innerText = "Sai tên đăng nhập hoặc mật khẩu!";
      msg.style.color = "red";
      return;
    }

    const user = await res.json();

    // ✅ Xoá dữ liệu cũ trước khi lưu mới
    localStorage.clear();
    sessionStorage.clear();
    saveUser(user);

    // ✅ Redirect theo vai trò
    if (user.role === "admin") {
      window.location.replace("index.html");
    } else if (user.role === "nhanvien") {
      window.location.replace("dashboard_nv.html");
    } else {
      msg.innerText = "Tài khoản không hợp lệ!";
      msg.style.color = "red";
    }

  } catch (err) {
    console.error(err);
    msg.innerText = "Lỗi kết nối server hoặc máy chủ chưa chạy.";
    msg.style.color = "red";
  }
}
