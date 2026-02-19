import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { categories, priorities } from '../constants';

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('billing');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    if (!description) return;
    setSuggesting(true);
    axios
      .post('/api/tickets/classify/', { description })
      .then((res) => {
        const { suggested_category, suggested_priority } = res.data;
        if (suggested_category) setCategory(suggested_category);
        if (suggested_priority) setPriority(suggested_priority);
      })
      .catch(() => {})
      .finally(() => setSuggesting(false));
  }, [description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('/api/tickets/', { title, description, category, priority })
      .then(() => {
        setTitle('');
        setDescription('');
        setCategory('billing');
        setPriority('low');
        if (onCreated) onCreated();
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2>Create Ticket</h2>
      <div>
        <label>Title:</label>
        <br />
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>
      <div>
        <label>Description:</label>
        <br />
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          cols={50}
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>
      {suggesting && <span> (classifying...)</span>}
    </form>
  );
}
