async function loadLuongNV() {
  const user = getUser();
  const data = await apiGet("luong");
  const own = data.filter(l => l.nhanvien_id === user.nhanvien_id);
  const tbody = document.getElementById("tbody-luong");
  tbody.innerHTML = "";
  own.forEach(l => {
    tbody.innerHTML += `
      <tr>
        <td>${l.thang}</td>
        <td>${l.luong_co_ban}</td>
        <td>${l.phu_cap}</td>
        <td>${l.khau_tru}</td>
        <td>${l.tong_luong}</td>
      </tr>`;
  });
}
