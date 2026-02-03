
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { home, studio } = req.body;
    const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
    const repoFull = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO; // e.g. "owner/repo"

    if (!token || !repoFull) {
        return res.status(500).json({ error: 'GitHub configuration missing on server' });
    }

    const [owner, repo] = repoFull.split('/');

    try {
        const results = [];

        // 1. Save Home Content
        if (home) {
            const homePath = 'public/content/pages/home.json';
            results.push(await commitFile(owner, repo, homePath, home, token, 'Update home page content via Editor'));
        }

        // 2. Save Studio Content
        if (studio) {
            const studioPath = 'public/content/pages/studio.json';
            results.push(await commitFile(owner, repo, studioPath, studio, token, 'Update studio page content via Editor'));
        }

        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error('GitHub Commit Error:', error);
        res.status(500).json({ error: error.message || 'Failed to commit to GitHub' });
    }
}

async function commitFile(owner, repo, path, content, token, message) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // Get current file to get SHA
    const getRes = await fetch(url, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    let sha;
    if (getRes.status === 200) {
        const fileData = await getRes.json();
        sha = fileData.sha;
    } else if (getRes.status !== 404) {
        const err = await getRes.json();
        throw new Error(`Failed to get file ${path}: ${err.message}`);
    }

    // Update file
    const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
            sha
        })
    });

    if (!putRes.ok) {
        const err = await putRes.json();
        throw new Error(`Failed to update file ${path}: ${err.message}`);
    }

    return await putRes.json();
}
