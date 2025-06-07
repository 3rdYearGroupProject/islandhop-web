import React from 'react';
import '../Page.css';

const Support = () => {
  const tickets = [
    { id: 1, title: 'Payment Issue', status: 'Open', priority: 'High', created: 'Today' },
    { id: 2, title: 'App Login Problem', status: 'In Progress', priority: 'Medium', created: 'Yesterday' },
    { id: 3, title: 'Route Suggestion', status: 'Resolved', priority: 'Low', created: '2 days ago' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Support</h1>
        <p>Customer support tickets and help desk</p>
      </div>
      <div className="page-content-card">
        <div className="page-content">
          <div className="support-tickets">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-header">
                  <h3>#{ticket.id} - {ticket.title}</h3>
                  <span className={`priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="ticket-meta">
                  <span className={`status ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                  <span className="created">Created: {ticket.created}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
