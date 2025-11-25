function toDateOnly(iso) {
  return new Date(iso).toISOString().split("T")[0];
}
function getTodayVN() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
}

function getTimeNow() {
  const now = new Date();
  return now.toLocaleTimeString("vi-VN", { hour12: false });
}

async function loadChamCongNV() {
  const user = getUser();
  const all = await apiGet("chamcong");
  const records = all.filter(cc => cc.nhanvien_id === user.nhanvien_id);

  const tbody = document.getElementById("tbody-cc");
  tbody.innerHTML = "";
  records.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${toDateOnly(r.ngay)}</td>
        <td>${r.gio_vao || "-"}</td>
        <td>${r.gio_ra || "-"}</td>
        <td>${r.trang_thai}</td>
      </tr>`;
  });
}

async function checkIn() {
  const user = getUser();
  const today = new Date().toISOString().split("T")[0];
  const list = await apiGet("chamcong");

  // kiểm tra hôm nay đã có bản ghi chưa
  const exist = list.find(cc => 
    cc.nhanvien_id === user.nhanvien_id &&
    toDateOnly(cc.ngay) === today
  );
  if (exist) {
    alert("Bạn đã chấm công vào hôm nay rồi!");
    return;
  }

  const data = {
    nhanvien_id: user.nhanvien_id,
    ngay: today,
    gio_vao: getTimeNow(),
    gio_ra: null,
    trang_thai: "Đang làm việc"
  };
  await apiPost("chamcong", data);
  loadChamCongNV();
}

async function checkOut() {
  const user = getUser();
  const list = await apiGet("chamcong");
  const todayStr = new Date().toISOString().split("T")[0];
  const today = list.find(cc => 
    cc.nhanvien_id === user.nhanvien_id &&
    toDateOnly(cc.ngay) === todayStr
  );

  if (!today) {
    alert("Bạn chưa chấm công vào hôm nay!");
    return;
  }

  if (today.gio_ra) {
    alert("Bạn đã chấm công ra rồi!");
    return;
  }

  const data = {
    gio_ra: getTimeNow(),
    trang_thai: "Hoàn thành"
  };
  await apiPut(`chamcong/${today.id}`, data);
  loadChamCongNV();
}
