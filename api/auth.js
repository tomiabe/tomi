export default function handler(req, res) {
  const { host } = req.headers;
  const client_id = process.env.OAUTH_CLIENT_ID;
  const scope = 'repo,user';

  if (!client_id) {
    return res.status(500).send('Environment variable OAUTH_CLIENT_ID not configured');
  }

  // Use the host header to determine the callback URL dynamically, 
  // but allow override via environment variable for maximum reliability.
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirect_uri = process.env.OAUTH_REDIRECT_URI || `${protocol}://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id,
    scope,
    redirect_uri
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}