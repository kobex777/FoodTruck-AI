import React from 'react';

// Define the props for EventCard
interface EventCardProps {
  id: string;
  name: string;
  start: string;
  url: string;
}

// Minimal, reusable event card component
const EventCard: React.FC<EventCardProps> = ({ id, name, start, url }) => {
  return (
    // Card container with Tailwind styling
    <div className="border rounded p-4 mb-3 shadow" key={id}>
      {/* Event name as a heading, linked to the event URL */}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <h2 className="font-semibold text-lg mb-1 text-blue-700 hover:underline">{name}</h2>
      </a>
      {/* Formatted event date */}
      <p className="text-gray-600">{new Date(start).toLocaleString()}</p>
    </div>
  );
};

export default EventCard;
