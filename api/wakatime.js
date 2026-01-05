export default async function handler(req, res) {
  const API_KEY = process.env.WAKATIME_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "WAKATIME_API_KEY belum diset" });
  }

  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          Authorization: "Basic " + Buffer.from(API_KEY).toString("base64"),
        },
      }
    );

    const json = await response.json();

    if (!json.data) {
      return res.status(500).json({ error: "Data WakaTime kosong" });
    }

    res.status(200).json({
      total_time: json.data.cumulative_total?.text || "0 sec",
      languages: (json.data.languages || []).slice(0, 5).map((lang) => ({
        name: lang.name,
        text: lang.text,
        percent: lang.percent, // ✅ PENTING
      })),
    });
  } catch (err) {
    console.error("WakaTime error:", err);
    res.status(500).json({ error: "Gagal mengambil data WakaTime" });
  }
}
