import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['', 'billing', 'technical', 'account', 'general'];
const priorities = ['', 'low', 'medium', 'high', 'critical'];
const statuses = ['', 'open', 'in_progress', 'resolved', 'closed'];

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ category: '', priority: '', status: '' });
  const [search, setSearch] = useState('');

  const load = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status) params.status = filters.status;
    if (search) params.search = search;
    axios.get('/api/tickets/', { params }).then((res) => setTickets(res.data));
  };

  useEffect(() => {
    load();
  }, [filters, search]);

  const handleStatusChange = (id, status) => {
    axios
      .patch(`/api/tickets/${id}/`, { status })
      .then(() => load());
  };

  return (
    <div>
      <h2>Tickets</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Search:{' '}
          <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Category:{' '}
          <select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c || 'All'}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '10px' }}>
          Priority:{' '}
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p || 'All'}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '10px' }}>
          Status:{' '}
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s || 'All'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.description.slice(0, 50)}{t.description.length>50?'...':''}</td>
              <td>{t.category}</td>
              <td>{t.priority}</td>
              <td>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                >
                  {statuses
                    .slice(1)
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
