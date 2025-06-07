import React from 'react';
import '../Page.css';

const Trips = () => {
  const trips = [
    { id: 1, from: 'Honolulu Airport', to: 'Waikiki Beach', driver: 'John Doe', status: 'Completed' },
    { id: 2, from: 'Pearl Harbor', to: 'Diamond Head', driver: 'Jane Smith', status: 'In Progress' },
    { id: 3, from: 'Maui Airport', to: 'Haleakala', driver: 'Mike Johnson', status: 'Scheduled' },
  ];

  return (
    <div className="page">
      <div className="page-content-card">
        <div className="page-header">
          <h1>Trips</h1>
          <p>Manage all island transportation trips</p>
        </div>
      <div className="page-content">
        <div className="trips-table">
          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>From</th>
                <th>To</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td>#{trip.id}</td>
                  <td>{trip.from}</td>
                  <td>{trip.to}</td>
                  <td>{trip.driver}</td>
                  <td>
                    <span className={`status ${trip.status.toLowerCase().replace(' ', '-')}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
