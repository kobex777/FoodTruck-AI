import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse the authorization code from the query string
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }
  // Build the URL-encoded form data for the token exchange
  const body = new URLSearchParams({
    client_id: process.env.MEETUP_CLIENT_ID!,
    client_secret: process.env.MEETUP_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: process.env.MEETUP_REDIRECT_URI!,
    code: code as string
  }).toString();
  // POST the form data to Meetup's token endpoint
  const response = await fetch('https://secure.meetup.com/oauth2/access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const json = await response.json();
  // Handle error responses from Meetup
  if (json.error) {
    return res.status(500).json({ error: json.error });
  }
  // Extract tokens and expiration from the response
  const { access_token, refresh_token, expires_in } = json;
  return res.status(200).json({ access_token, refresh_token, expires_in });
}
