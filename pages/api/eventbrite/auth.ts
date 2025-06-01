import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { EVENTBRITE_CLIENT_ID, EVENTBRITE_REDIRECT_URI } = process.env;
  const authUrl = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${EVENTBRITE_CLIENT_ID}&redirect_uri=${encodeURIComponent(EVENTBRITE_REDIRECT_URI!)}`;
  res.redirect(authUrl);
}
