import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to IslandHop</h1>
      <p>Your next adventure awaits!</p>
      <div className="button-container">
        <button onClick={() => navigate('/login')} className="primary-button">
          Login
        </button>
        <button onClick={() => navigate('/signup')} className="secondary-button">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
