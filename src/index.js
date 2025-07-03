import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
