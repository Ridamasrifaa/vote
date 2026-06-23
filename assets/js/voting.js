const supabaseClient = supabase.createClient("https://fpxlrisbwrxitqqusnph.supabase.co", "sb_publishable_ui1Ag7QLz03qxX8MC5EafA_FjDGap0s");

async function hitungRekap() {
  const { data, error } = await supabaseClient.from("feedbacks").select("name, feedback_text, rating").order("id", { ascending: false });

  if (error) {
    document.getElementById("hasil").innerHTML = "Gagal memuat data.";
    document.getElementById("feedbackTable").innerHTML = "";
    return;
  }

  const totalResponden = data.length;
  const kategori = [
    { nama: "Bosan", class: "Bosan" },
    { nama: "Kurang", class: "Kurang" },
    { nama: "Biasa", class: "Biasa" },
    { nama: "Puas", class: "Puas" },
    { nama: "Sangat Puas", class: "Sangat-Puas" },
  ];

  const counts = {
    Bosan: 0,
    Kurang: 0,
    Biasa: 0,
    Puas: 0,
    "Sangat Puas": 0,
  };

  data.forEach((item) => {
    if (counts.hasOwnProperty(item.rating)) counts[item.rating]++;
  });

  let html = "";
  kategori.forEach((k) => {
    const persentase = totalResponden > 0 ? (counts[k.nama] / totalResponden) * 100 : 0;

    html += `
                <div class="item">
                    <div class="label-row">
                        <span>${k.nama}</span>
                        <span>${counts[k.nama]}</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill fill-${k.class}" style="width: ${persentase}%"></div>
                    </div>
                </div>`;
  });

  document.getElementById("hasil").innerHTML = html;
  document.getElementById("total").innerText = "Total Partisipan: " + totalResponden + " orang";

  if (!data.length) {
    document.getElementById("feedbackTable").innerHTML = '<p class="empty-state">Belum ada data feedback.</p>';
    return;
  }

  let tableHtml = `
            <table class="detail-table">
                <thead>
                    <tr>
                       <!-- <th style="width: 18%;">Nama</th> -->
                        <th style="width: 64%;">Feedback</th>
                        <th style="width: 18%;">Rating</th>
                    </tr>
                </thead>
                <tbody>`;

  data.forEach((item) => {
    const name = item.name ? item.name : "Anonim";
    const feedbackText = item.feedback_text ? item.feedback_text : "Tidak ada pesan kesan";
    const rating = item.rating || "-";

    tableHtml += `
                    <tr>
                       <!-- <td>${name}</td> -->
                        <td class="feedback-cell">${feedbackText}</td>
                        <td><span class="rating-badge">${rating}</span></td>
                    </tr>`;
  });

  tableHtml += `
                </tbody>
            </table>`;

  document.getElementById("feedbackTable").innerHTML = tableHtml;
}

hitungRekap();
