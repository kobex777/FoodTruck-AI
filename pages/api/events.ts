// /api/events - Next.js API route for fetching local events from Ticketmaster Discovery API

import type { NextApiRequest, NextApiResponse } from 'next';

// Ticketmaster Discovery API integration
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

// Fetches up to 1000 events (10 pages x 100) safely from Ticketmaster Discovery API for a given location/date.
async function searchEventsByLocation(location: string, date?: string) {
  if (!TICKETMASTER_API_KEY) throw new Error('Ticketmaster API key not configured');
  const pageSize = 100; // Safe, high value for Ticketmaster API
  let currentPage = 0;
  let allEvents: any[] = [];
  let totalPages = 1; // Will update after first fetch
  let totalElements = 0;
  // Loop to fetch up to 10 pages (1000 events max)
  while (currentPage < totalPages && currentPage < 10) {
    const params = new URLSearchParams({
      sort: 'date,asc',
      apikey: TICKETMASTER_API_KEY,
      size: pageSize.toString(),
      page: currentPage.toString(),
    });
    // For Los Angeles, mimic Ticketmaster.com: use dmaId, latlong, radius, includeTBA, includeTBD, and correct date range
    if (location.trim().toLowerCase() === 'los angeles') {
      params.set('dmaId', '324');
      params.set('latlong', '34.0522,-118.2437');
      params.set('radius', '50');
      params.set('includeTBA', 'no');
      params.set('includeTBD', 'no');
      if (date) {
        params.set('startDateTime', `${date}T00:00:00Z`);
        params.set('endDateTime', `${date}T23:59:59Z`);
      }
    } else {
      params.set('countryCode', 'US');
      params.set('city', location);
      if (date) {
        params.set('startDateTime', `${date}T00:00:00Z`);
        params.set('endDateTime', `${date}T23:59:59Z`);
      }
    }
    const url = `${TICKETMASTER_API_URL}?${params.toString()}`;
    console.log('Ticketmaster API URL:', url);
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Ticketmaster API error response:', errorText);
      throw new Error('Failed to fetch events from Ticketmaster');
    }
    const data = await res.json();
    totalPages = data.page?.totalPages ?? 0;
    totalElements = data.page?.totalElements ?? 0;
    // Basic error check for events
    if (data._embedded && Array.isArray(data._embedded.events)) {
      allEvents.push(...data._embedded.events.map((event: any) => ({
        id: event.id,
        name: event.name,
        start: event.dates?.start?.localDate || '',
        url: event.url,
        image: event.images?.[0]?.url || '',
        venue: event._embedded?.venues?.[0]?.name || '',
        city: event._embedded?.venues?.[0]?.city?.name || '',
        state: event._embedded?.venues?.[0]?.state?.name || '',
        country: event._embedded?.venues?.[0]?.country?.name || '',
      })));
    }
    // Stop if there are no more pages
    currentPage++;
  }
  return { events: allEvents, totalPages, totalElements };

}


// API route for searching events by location/date using a pluggable provider
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Read location and date from query params
  const { location, date } = req.query;
  if (typeof location !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid location query param.' });
  }
  // 2. Use the provider for location-based search, aggregate up to 1000 events
  try {
    const { events, totalPages, totalElements } = await searchEventsByLocation(location, date as string | undefined);
    return res.status(200).json({ events, totalPages, totalElements });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

