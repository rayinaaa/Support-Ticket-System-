import React, { useState, useEffect } from 'react';
import API from './api';
import { categories, priorities, statuses } from './constants';

function App() {
  // State for ticket form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('billing');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  // State for ticket list
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ category: '', priority: '', status: '' });
  const [search, setSearch] = useState('');

  // State for stats
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load tickets
  const loadTickets = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status) params.status = filters.status;
    if (search) params.search = search;
    API.get('/api/tickets/tickets/', { params }).then((res) => setTickets(res.data));
  };

  // Load stats
  const loadStats = () => {
    API.get('/api/tickets/stats/').then((res) => setStats(res.data));
  };

  // AI classification effect
  useEffect(() => {
    if (!description) return;
    setSuggesting(true);
    API
      .post('/api/tickets/classify/', { description })
      .then((res) => {
        const { suggested_category, suggested_priority } = res.data;
        if (suggested_category) setCategory(suggested_category);
        if (suggested_priority) setPriority(suggested_priority);
      })
      .catch(() => {})
      .finally(() => setSuggesting(false));
  }, [description]);

  // Load tickets when filters change
  useEffect(() => {
    loadTickets();
  }, [filters, search]);

  // Load stats when refreshKey changes
  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    API
      .post('/api/tickets/tickets/', { title, description, category, priority })
      .then(() => {
        setTitle('');
        setDescription('');
        setCategory('billing');
        setPriority('low');
        setRefreshKey((k) => k + 1);
        loadTickets();
      })
      .finally(() => setLoading(false));
  };

  // Handle status change
  const handleStatusChange = (id, status) => {
    API
      .patch(`/api/tickets/tickets/${id}/`, { status })
      .then(() => {
        loadTickets();
        loadStats();
      });
  };

  // Filter arrays for dropdowns
  const allCategories = ['', ...categories];
  const allPriorities = ['', ...priorities];
  const allStatuses = ['', ...statuses];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          fontSize: '2.5rem', 
          margin: '0 0 10px 0' 
        }}>🎫 Support Ticket System</h1>
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '1.1rem', 
          margin: 0 
        }}>Manage and track support requests efficiently</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Create Ticket Form */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ color: '#2c3e50', marginTop: 0 }}>📝 Create New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="Brief description of the issue"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Detailed description of the problem"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '12px', 
                backgroundColor: loading ? '#bdc3c7' : '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
            
            {suggesting && (
              <div style={{ 
                marginTop: '10px', 
                padding: '8px', 
                backgroundColor: '#e8f4fd', 
                borderRadius: '5px',
                fontSize: '14px',
                color: '#2980b9'
              }}>
                🤖 AI is analyzing and suggesting category/priority...
              </div>
            )}
          </form>
        </div>

        {/* Statistics Dashboard */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ color: '#2c3e50', marginTop: 0 }}>📊 Statistics Dashboard</h2>
          
          {!stats ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>Loading stats...</div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_tickets}</div>
                  <div>Total Tickets</div>
                </div>
                
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#e74c3c', 
                  color: 'white', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.open_tickets}</div>
                  <div>Open Tickets</div>
                </div>
              </div>
              
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                <strong>Average per Day: {stats.avg_tickets_per_day.toFixed(2)}</strong>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Priority Breakdown:</h4>
                {Object.entries(stats.priority_breakdown).map(([k, v]) => (
                  <div key={k} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '5px 0',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{k}:</span>
                    <span style={{ fontWeight: 'bold', color: '#2980b9' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Category Breakdown:</h4>
                {Object.entries(stats.category_breakdown).map(([k, v]) => (
                  <div key={k} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '5px 0',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{k}:</span>
                    <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket List */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ color: '#2c3e50', marginTop: 0 }}>🎟️ All Tickets</h2>
        
        {/* Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Search:</label>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '14px'
              }}
              placeholder="Search title or description"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c || 'All Categories'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority:</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              {allPriorities.map((p) => (
                <option key={p} value={p}>
                  {p || 'All Priorities'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {s || 'All Statuses'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    color: '#7f8c8d',
                    fontSize: '16px'
                  }}>
                    No tickets found. Create your first ticket above! 🎫
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr key={ticket.id} style={{ 
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ticket.title}</td>
                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                      {ticket.description.length > 50 
                        ? ticket.description.slice(0, 50) + '...' 
                        : ticket.description}
                    </td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{ticket.category}</td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{ticket.priority}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        style={{ 
                          padding: '5px 8px', 
                          border: '1px solid #ddd', 
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: 'white'
                        }}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#7f8c8d' }}>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        padding: '20px',
        color: '#7f8c8d',
        fontSize: '14px'
      }}>
        <p>🎫 Support Ticket System - Built with React & Django REST Framework</p>
      </div>
    </div>
  );
}

export default App;
