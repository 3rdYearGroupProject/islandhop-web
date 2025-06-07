import React from 'react';
import '../Page.css';

const RidePools = () => {
  const pools = [
    { id: 1, route: 'Airport to Waikiki', riders: 4, maxRiders: 6, departure: '2:30 PM' },
    { id: 2, route: 'Downtown to Pearl Harbor', riders: 3, maxRiders: 4, departure: '3:45 PM' },
    { id: 3, route: 'Maui Circle Tour', riders: 8, maxRiders: 12, departure: '9:00 AM' },
  ];

  return (
    <div className="page">
      <div className="page-content-card">
        <div className="page-header">
          <h1>Ride Pools</h1>
          <p>Shared transportation across the islands</p>
        </div>
        <div className="page-content">
        <div className="pools-grid">
          {pools.map(pool => (
            <div key={pool.id} className="pool-card">
              <h3>{pool.route}</h3>
              <div className="pool-info">
                <p><strong>Riders:</strong> {pool.riders}/{pool.maxRiders}</p>
                <p><strong>Departure:</strong> {pool.departure}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${(pool.riders / pool.maxRiders) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default RidePools;
