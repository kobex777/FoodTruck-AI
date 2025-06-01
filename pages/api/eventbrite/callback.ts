import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const { EVENTBRITE_CLIENT_ID, EVENTBRITE_CLIENT_SECRET, EVENTBRITE_REDIRECT_URI } = process.env;

  const tokenRes = await fetch('https://www.eventbrite.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: EVENTBRITE_CLIENT_ID!,
      client_secret: EVENTBRITE_CLIENT_SECRET!,
      code,
      redirect_uri: EVENTBRITE_REDIRECT_URI!
    })
  });
  const tokenData = await tokenRes.json();

  // For now, just show the token (in production, save it to session/db)
  res.status(200).json(tokenData);
}
