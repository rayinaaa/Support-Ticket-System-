import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const onTicketCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Support Ticket System</h1>
      <TicketForm onCreated={onTicketCreated} />
      <StatsDashboard refreshKey={refreshKey} />
      <TicketList />
    </div>
  );
}

export default App;
