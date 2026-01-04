export default async function handler(req, res) {
    const API_KEY = process.env.WAKATIME_API_KEY;

    const response = await fetch(
        "https://wakatime.com/api/v1/users/current/stats/last_7_days",
        {
            headers: {
                Authorization: "Basic " + Buffer.from(API_KEY).toString("base64")
            }
        }
    );

    const data = await response.json();

    res.status(200).json({
        total_time: data.data.human_readable_total,
        languages: data.data.languages.slice(0, 5)
    });
}
