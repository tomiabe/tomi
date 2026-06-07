
export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/content/pages/home.json`);
    const data = await response.json();
    const avatarPath = data?.intro?.avatar || '/images/tomi-1-bw.jpeg';
    const avatarUrl = `${baseUrl}${avatarPath}`;

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, must-revalidate');
    res.status(302);
    res.setHeader('Location', avatarUrl);
    res.end();
  } catch {
    res.status(302);
    res.setHeader('Location', `${baseUrl}/images/tomi-1-bw.jpeg`);
    res.end();
  }
}
