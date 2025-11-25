async function loadThongKe() {
  try {
    const data = await apiGet("thongke");

    // Gán số liệu
    document.getElementById("nv").textContent = data.tong_nv;
    document.getElementById("cc").textContent = data.chamcong_hom_nay;
    document.getElementById("cho").textContent = data.don_cho_duyet;
    document.getElementById("duyet").textContent = data.don_da_duyet;
    document.getElementById("tc").textContent = data.don_tu_choi;

    // Biểu đồ cột: Nghỉ phép
    const ctx1 = document.getElementById("chartDon");
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["Chờ duyệt", "Đã duyệt", "Từ chối"],
        datasets: [{
          label: "Trạng thái đơn nghỉ phép",
          data: [data.don_cho_duyet, data.don_da_duyet, data.don_tu_choi],
          backgroundColor: ["#facc15", "#22c55e", "#ef4444"]
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Biểu đồ nghỉ phép" } },
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

    // Biểu đồ line: Chấm công 7 ngày gần nhất
    const ctx2 = document.getElementById("chartCC");
    const days = data.chamcong_7ngay.map(x => x.ngay);
    const values = data.chamcong_7ngay.map(x => x.so_luot);

    new Chart(ctx2, {
      type: "line",
      data: {
        labels: days,
        datasets: [{
          label: "Số lượt chấm công 7 ngày gần nhất",
          data: values,
          fill: true,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.3
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Thống kê chấm công theo ngày" } },
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

  } catch (err) {
    console.error("💥 Lỗi tải thống kê:", err);
  }
}
