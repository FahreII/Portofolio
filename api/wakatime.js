// File: /api/wakatime.js
export default async function handler(req, res) {
  const API_KEY = process.env.WAKATIME_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key WakaTime tidak ditemukan" });
  }

  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(API_KEY + ":").toString("base64"),
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Gagal ambil data dari WakaTime",
      });
    }

    const data = await response.json();

    res.status(200).json({
      total_time: data.data?.cumulative_total?.text || "0 sec",
      languages: (data.data?.languages || []).slice(0, 5).map((lang) => ({
        name: lang.name,
        text: lang.text,
        percent: lang.percent,
      })),
    });
  } catch (err) {
    console.error("WakaTime Error:", err);
    res.status(500).json({ error: "Server error WakaTime" });
  }
}
