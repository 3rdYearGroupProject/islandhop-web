import React from 'react';
import '../Page.css';

const Messaging = () => {
  const messages = [
    { id: 1, from: 'Driver John', message: 'Running 5 minutes late', time: '2:45 PM', unread: true },
    { id: 2, from: 'Customer Sarah', message: 'Can you pick me up at the hotel lobby?', time: '2:30 PM', unread: true },
    { id: 3, from: 'Driver Mike', message: 'Trip completed successfully', time: '1:15 PM', unread: false },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Messaging</h1>
        <p>Communications with drivers and customers</p>
      </div>
      <div className="page-content-card">
        <div className="page-content">
          <div className="messages-list">
            {messages.map(message => (
              <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                <div className="message-header">
                  <span className="sender">{message.from}</span>
                  <span className="time">{message.time}</span>
                </div>
                <p className="message-text">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
