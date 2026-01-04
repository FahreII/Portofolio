export default async function handler(req, res) {
  const username = "FahreII";
  const year = new Date().getFullYear();

  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.cloak-preview",
  };

  try {
    const user = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    }).then((r) => r.json());

    const commits = await fetch(
      `https://api.github.com/search/commits?q=author:${username}+committer-date:${year}-01-01..${year}-12-31`,
      { headers }
    ).then((r) => r.json());

    res.status(200).json({
      repos: user.public_repos,
      followers: user.followers,
      commits: commits.total_count,
    });
  } catch {
    res.status(500).json({ repos: "–", followers: "–", commits: "–" });
  }
}
