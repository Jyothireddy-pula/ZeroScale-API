import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const API_BASE = 'https://api.zeroscale.dev/api/v1';

function App() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('zeroscale_token') || '');

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/hosts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setHosts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hosts');
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: formData.get('email'),
        password: formData.get('password')
      });
      
      const userToken = response.data.data.token;
      localStorage.setItem('zeroscale_token', userToken);
      setToken(userToken);
      setError('');
      await fetchHosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('zeroscale_token');
    setToken('');
    setHosts([]);
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>ZeroScale API Demo</h1>
          <nav>
            {token ? (
              <button onClick={logout} className="logout-btn">Logout</button>
            ) : (
              <Link to="/login" className="login-link">Login</Link>
            )}
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/login" element={<Login onLogin={login} error={error} />} />
            <Route path="/" element={
              <HostList 
                hosts={hosts} 
                loading={loading} 
                error={error}
                token={token}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Login({ onLogin, error }) {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to ZeroScale API</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

function HostList({ hosts, loading, error, token }) {
  if (loading) return <div className="loading">Loading hosts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hosts-container">
      <h2>Hosts ({hosts.length})</h2>
      <div className="hosts-grid">
        {hosts.map(host => (
          <div key={host._id} className="host-card">
            <h3>{host.name}</h3>
            <p className="state">{host.state}</p>
            <p className="rating">⭐ {host.rating}/5</p>
            <p className="description">{host.description}</p>
            <div className="host-actions">
              {token && (
                <Link to={`/hosts/${host._id}/reviews`} className="reviews-btn">
                  View Reviews
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
