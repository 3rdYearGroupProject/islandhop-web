import React from 'react';
import '../Page.css';

const Emergency = () => {
  const incidents = [
    { id: 1, type: 'Vehicle Breakdown', location: 'Highway 1, Mile 23', status: 'Active', time: '15 min ago' },
    { id: 2, type: 'Medical Emergency', location: 'Waikiki Beach Area', status: 'Resolved', time: '1 hour ago' },
    { id: 3, type: 'Weather Alert', location: 'North Shore Routes', status: 'Monitoring', time: '2 hours ago' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Emergency</h1>
        <p>Emergency incidents and response management</p>
      </div>
      <div className="page-content-card">
        <div className="page-content">
          <div className="emergency-alert">
            <h3>⚠️ Emergency Hotline: 911</h3>
            <p>For immediate assistance, contact local emergency services</p>
          </div>
          <div className="incidents-list">
            {incidents.map(incident => (
              <div key={incident.id} className={`incident-item ${incident.status.toLowerCase()}`}>
                <div className="incident-header">
                  <h3>{incident.type}</h3>
                  <span className={`status ${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>
                <p className="location">{incident.location}</p>
                <span className="time">{incident.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
