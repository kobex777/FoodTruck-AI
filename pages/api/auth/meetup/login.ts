import type { NextApiRequest, NextApiResponse } from 'next';

// Redirects user to Meetup for OAuth authorization.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authUrl = `https://secure.meetup.com/oauth2/authorize`
    + `?client_id=${encodeURIComponent(process.env.MEETUP_CLIENT_ID!)}`
    + `&response_type=code`
    + `&redirect_uri=${encodeURIComponent(process.env.MEETUP_REDIRECT_URI!)}`;
  res.redirect(authUrl);
}
