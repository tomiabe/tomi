export default async function handler(req, res) {
  const code = req.query.code;
  const client_id = process.env.OAUTH_CLIENT_ID;
  const client_secret = process.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();
    const token = data.access_token;

    // Check if we got an error from GitHub
    if (data.error) {
      return res.status(400).send(`GitHub Error: ${data.error_description}`);
    }

    // VERIFICATION STEP: Check if this token can actually see the repo
    const repoCheck = await fetch('https://api.github.com/repos/tomiabe/tomiabe', {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'TomiAbe-Website'
      }
    });

    if (!repoCheck.ok) {
      const errInfo = await repoCheck.json();
      const status = repoCheck.status;
      console.error(`Repo check failed: ${status}`, errInfo);

      // Return a clear error to the user in the popup
      let userMsg = `Error: Token generated, but cannot access repo 'tomiabe/tomiabe' (Status ${status}).`;
      if (status === 404) {
        userMsg += " <br><b>Possible reasons:</b><br>1. Repo does not exist.<br>2. Repo is Private and you have not granted access.<br>3. You are not a collaborator.";
      } else if (status === 403) {
        userMsg += " <br><b>Access Forbidden.</b> Check Organization permissions.";
      }
      return res.status(400).send(userMsg);
    }

    const content = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token })}', 
            message.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}