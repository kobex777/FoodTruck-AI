import React, { useState } from 'react';
// Import Navbar component
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

// Minimal Next.js page for searching and displaying events
export default function Home() {
  // State for controlled inputs
  const [location, setLocation] = useState('Denver'); // Default value
  const [date, setDate] = useState('2025-05-20');     // Default value (YYYY-MM-DD)

  // State for events, loading, and error
  const [events, setEvents] = useState<Array<{ id: string; name: string; start: string; url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch events from API using current input values
  async function fetchEvents(e?: React.FormEvent, pageOverride?: number, sizeOverride?: number) {
    if (e) e.preventDefault(); // Prevent default form submit
    setLoading(true); // Show loading
    setError(null);   // Reset error
    setEvents([]);    // Reset events
    const pageToFetch = typeof pageOverride === 'number' ? pageOverride : page;
    const sizeToFetch = typeof sizeOverride === 'number' ? sizeOverride : pageSize;
    try {
      const res = await fetch(`/api/events?location=${encodeURIComponent(location)}&date=${date}&page=${pageToFetch}&size=${sizeToFetch}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPageSize(data.pageSize || sizeToFetch);
      let newPage = data.page ?? pageToFetch;
      setPage(newPage);
      if (!Array.isArray(data.events) || data.events.length === 0) {
        setError('No events found for this location and date.');
        setEvents([]);
      } else {
        setEvents(data.events);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events.');
      setEvents([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false); // Hide loading
    }
  }

  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      <main className="max-w-xl mx-auto py-10 px-4">
        {/* Page heading */}
        <h1 className="text-2xl font-bold mb-6">Search Local Events</h1>
        {/* Search form with controlled inputs */}
        <form onSubmit={e => { setPage(0); fetchEvents(e, 0, pageSize); }} className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Location input */}
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
            className="border rounded px-3 py-2 flex-1"
          />
          {/* Date input */}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={e => {
              const newSize = parseInt(e.target.value, 10);
              setPageSize(newSize);
              setPage(0);
              fetchEvents(undefined, 0, newSize);
            }}
            className="border rounded px-3 py-2"
            style={{ minWidth: 90 }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={200}>200 per page</option>
          </select>
          {/* Search button */}
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        {/* Loading state */}
        {loading && <div className="mb-4">Loading...</div>}
        {/* Error state */}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {/* Events list */}
        {events.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
        {/* Pagination controls at the bottom */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => {
              if (page > 0) {
                const newPage = page - 1;
                fetchEvents(undefined, newPage, pageSize);
              }
            }}
            disabled={page === 0 || loading}
          >
            &#8592; Prev
          </button>
          <span>Page {page + 1} of {totalPages || 1} ({totalElements} events)</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => {
              if (totalPages > 0 && page < totalPages - 1) {
                const newPage = page + 1;
                fetchEvents(undefined, newPage, pageSize);
              }
            }}
            disabled={loading || totalPages === 0 || page >= totalPages - 1}
          >
            Next &#8594;
          </button>
        </div>
      </main>
    </>
  );
}
