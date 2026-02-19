import React, { useState, useEffect } from 'react';
import API from '../api';

export default function StatsDashboard({ refreshKey }) {
  const [stats, setStats] = useState(null);

  const load = () => {
    API.get('/api/tickets/stats/').then((res) => setStats(res.data));
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Statistics</h2>
      <div>Total tickets: {stats.total_tickets}</div>
      <div>Open tickets: {stats.open_tickets}</div>
      <div>Avg per day: {stats.avg_tickets_per_day.toFixed(2)}</div>
      <div>
        Priority breakdown:
        <ul>
          {Object.entries(stats.priority_breakdown).map(([k, v]) => (
            <li key={k}>{k}: {v}</li>
          ))}
        </ul>
      </div>
      <div>
        Category breakdown:
        <ul>
          {Object.entries(stats.category_breakdown).map(([k, v]) => (
            <li key={k}>{k}: {v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
