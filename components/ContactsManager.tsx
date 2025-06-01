import React, { useEffect, useState } from 'react';

// Minimal ContactsManager component for managing contacts
const ContactsManager: React.FC = () => {
  // State for contacts list
  const [contacts, setContacts] = useState<Array<{ id: number; name: string; email: string; phone: string }>>([]);
  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // State for form submit loading
  const [submitting, setSubmitting] = useState(false);
  // State for client-side validation error
  const [validationError, setValidationError] = useState<string | null>(null);
  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch contacts on mount
  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/contacts');
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setContacts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch contacts.');
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  // Handle form submit to add new contact
  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null); // Clear previous validation errors

    // 1. Client-side validation: prevent blank fields
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setValidationError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // 2. Only send POST if all fields are filled
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) throw new Error(await res.text());
      // 3. Show success message if contact added (201)
      if (res.status === 201) {
        setSuccessMessage('Contact added!');
        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      const newContact = await res.json();
      setContacts(prev => [...prev, newContact]);
      setName(''); setEmail(''); setPhone(''); // 4. Clear form fields after success
    } catch (err: any) {
      setError(err.message || 'Failed to add contact.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      {/* Loading state for fetching contacts */}
      {loading && <div className="mb-4">Loading contacts...</div>}
      {/* Error state */}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {/* Contacts list */}
      {!loading && contacts.length > 0 && (
        <ul className="mb-6">
          {contacts.map(contact => (
            <li key={contact.id} className="border-b py-2 flex items-center justify-between">
              <span>
                <span className="font-medium">{contact.name}</span> – {contact.email} – {contact.phone}
              </span>
              {/* Delete button for each contact */}
              <button
                className="ml-4 text-red-600 hover:underline text-sm"
                onClick={async () => {
                  // 4. Show confirmation prompt before deleting
                  if (!window.confirm('Are you sure you want to delete this contact?')) return;
                  try {
                    // 2. Send DELETE request to API
                    const res = await fetch(`/api/contacts?id=${contact.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error(await res.text());
                    // 3. Remove contact from state after success
                    setContacts(prev => prev.filter(c => c.id !== contact.id));
                  } catch (err: any) {
                    setError(err.message || 'Failed to delete contact.');
                  }
                }}
                title="Delete contact"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Add contact form */}
      <form onSubmit={handleAddContact} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded px-3 py-2"
        />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-semibold rounded px-4 py-2 hover:bg-green-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
      {/* 3. Show validation error below the form if present */}
      {validationError && <div className="mt-2 text-red-600">{validationError}</div>}
      {/* 5. Show success message below the form if present */}
      {successMessage && <div className="mt-2 text-green-600">{successMessage}</div>}
    </div>
  );
};

export default ContactsManager;
