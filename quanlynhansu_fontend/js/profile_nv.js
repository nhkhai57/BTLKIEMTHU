async function loadProfile() {
  const user = getUser();
  const data = await apiGet(`nhanvien/${user.nhanvien_id}`);
  document.getElementById("ten").value = data.ten;
  document.getElementById("gioi_tinh").value = data.gioi_tinh;
  document.getElementById("chuc_vu").value = data.chuc_vu;
  document.getElementById("phong_ban").value = data.phong_ban;
}

async function updateProfile(e) {
  e.preventDefault();
  const user = getUser();

  const ten = document.getElementById("ten").value;
  const gioi_tinh = document.getElementById("gioi_tinh").value;
  const chuc_vu = document.getElementById("chuc_vu").value;
  const phong_ban = document.getElementById("phong_ban").value;

  await apiPut(`nhanvien/${user.nhanvien_id}`, {
    ten, gioi_tinh, chuc_vu, phong_ban
  });

  document.getElementById("msg").innerText = "✅ Cập nhật thành công!";
}
