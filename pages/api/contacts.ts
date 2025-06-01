// /api/contacts - Next.js API route for Supabase contacts table
// Handles GET (list) and POST (add) with clear error handling

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client from env vars
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET: List all contacts
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('contacts').select('*');
      if (error) throw error;
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).send(err.message || 'Error fetching contacts');
    }
  }

  // Handle POST: Add a new contact
  else if (req.method === 'POST') {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).send('Missing required fields');
      return;
    }
    try {
      const { data, error } = await supabase.from('contacts').insert([{ name, email, phone }]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).send(err.message || 'Error adding contact');
    }
  }

  // Handle DELETE: Remove a contact by id
  else if (req.method === 'DELETE') {
    // 1. Read the contact ID from req.query.id
    const { id } = req.query;
    // 2. If missing, return a 400 error
    if (!id) {
      res.status(400).send('Missing contact id');
      return;
    }
    try {
      // 3. Use Supabase to delete the contact with that ID
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      // 4. Return 200 on success
      res.status(200).json({ message: 'Contact deleted' });
    } catch (err: any) {
      // 5. Return 500 on DB error
      res.status(500).send(err.message || 'Error deleting contact');
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
