function toDateOnly(iso) {
  return new Date(iso).toISOString().split("T")[0];
}

async function loadNghiPhepNV() {
  const user = getUser();
  const all = await apiGet("nghiphep");
  const list = all.filter(np => np.nhanvien_id === user.nhanvien_id);

  const tbody = document.getElementById("tbody-np");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Chưa có đơn nghỉ phép nào</td></tr>`;
    return;
  }

  list.forEach(np => {
    tbody.innerHTML += `
      <tr>
        <td>${toDateOnly(np.tu_ngay)}</td>
        <td>${toDateOnly(np.den_ngay)}</td>
        <td>${np.ly_do}</td>
        <td>${np.trang_thai}</td>
      </tr>`;
  });
}

async function addNghiPhepNV(e) {
  e.preventDefault();
  const user = getUser();
  const tu_ngay = document.getElementById("tu_ngay").value;
  const den_ngay = document.getElementById("den_ngay").value;
  const ly_do = document.getElementById("ly_do").value;

  if (new Date(tu_ngay) > new Date(den_ngay)) {
    alert("❌ Ngày bắt đầu phải trước ngày kết thúc!");
    return;
  }

  const data = {
    nhanvien_id: user.nhanvien_id,
    tu_ngay,
    den_ngay,
    ly_do,
    trang_thai: "Chờ duyệt"
  };

  try {
    const res = await apiPost("nghiphep", data);
    alert(res.message || "✅ Gửi đơn nghỉ phép thành công!");
    loadNghiPhepNV();
  } catch (err) {
    console.error(err);
    alert("⚠️ Lỗi khi gửi đơn nghỉ phép!");
  }
}
