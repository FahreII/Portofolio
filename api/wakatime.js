// File: /api/wakatime.js
export default async function handler(req, res) {
  const API_KEY = process.env.WAKATIME_API_KEY;

  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          Authorization: "Basic " + Buffer.from(API_KEY).toString("base64"),
        },
      }
    );

    const data = await response.json();

    if (!data.data) {
      return res.status(500).json({ error: "Data WakaTime kosong" });
    }

    // Pastikan field yang dipakai cumulative_total.text
    res.status(200).json({
      total_time: data.data.cumulative_total.text || "0 sec",
      languages: (data.data.languages || []).slice(0, 5).map((lang) => ({
        name: lang.name,
        text: lang.text,
      })),
    });
  } catch (err) {
    console.error("Error fetching WakaTime:", err);
    res.status(500).json({ error: "Gagal fetch data WakaTime" });
  }
}
