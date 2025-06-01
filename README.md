# FoodTruck AI Companion

A smart AI-driven Next.js app to help food truckers discover local events, manage contacts, and get insights. Built with Next.js, React, Tailwind, and Supabase.

## Prerequisites
- **Node.js** v18+ recommended

## Setup Instructions

1. **Clone the repo**

2. **Install dependencies**
   ```sh
   npm install react react-dom next
   npm install --save-dev @types/react @types/react-dom
   ```

3. **Configure Eventbrite API**
   - Create a `.env.local` file in the project root.
   - Add your Eventbrite API token:
     ```env
     EVENTBRITE_TOKEN=your_eventbrite_api_token_here
     ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

## Key Files & Structure
- **API route:** [`pages/api/events.ts`](pages/api/events.ts)
- **Event card component:** [`components/EventCard.tsx`](components/EventCard.tsx)
- **Frontend page:** [`pages/index.tsx`](pages/index.tsx)

---

Any collaborator can follow these steps to install dependencies, set up the API token, and start the dev server without errors.
