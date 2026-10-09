import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from '../components/Toast';

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    state: 'Punjab',
    district: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;
    setLoading(true);
    const res = await login(loginForm.username, loginForm.password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.password || !registerForm.fullName) return;
    setLoading(true);
    const payload = {
      ...registerForm,
      email: registerForm.email && registerForm.email.trim().length > 0
        ? registerForm.email.trim()
        : `${registerForm.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@farmer.krishimitra.in`
    };
    const res = await register(payload);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const autofillDemo = () => {
    setLoginForm({ username: 'testfarmer', password: 'farmer123' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at 50% -20%, rgba(34, 197, 94, 0.15), rgba(8, 13, 8, 1) 70%)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        maxWidth: '960px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-green)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Left Hero Side */}
        <div style={{
          padding: '44px 36px',
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(5, 46, 22, 0.8))',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, var(--accent), #10b981)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: 'var(--shadow-glow)'
              }}>
                🌾
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Krishi<span style={{ color: 'var(--accent-bright)' }}>Mitra</span></h1>
                <p style={{ fontSize: '12px', color: 'var(--text-green)', fontWeight: 600 }}>कृषि मित्र • AI Crop Advisory</p>
              </div>
            </div>

            <h2 style={{ fontSize: '22px', lineHeight: 1.3, marginBottom: '14px' }}>
              Smart Agricultural Guidance for Precision Farming
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
              Empowering Indian farmers with scientific 7-parameter soil crop recommendations, Groq AI agricultural advisory, and pest management.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>🧪</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>7-Parameter Soil Suitability Classifier</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>⚡</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Groq AI Powered High-Speed Agronomist</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>🦠</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>17+ Plant Diseases with Organic Treatments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>📋</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Farm Yield & Revenue History Logging</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Trusted by farmers across Indian agro-climatic zones.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
              className={`btn ${!isRegister ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
            <button
              className={`btn ${isRegister ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>

          {!isRegister ? (
            <form onSubmit={handleLogin}>
              <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Welcome Back, Kisan Bhai! 🙏</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '22px' }}>
                Enter your username and password to access your dashboard.
              </p>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. testfarmer"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
              </button>

              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={autofillDemo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-bright)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ⚡ Fill Demo Credentials (testfarmer / farmer123)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Register New Farmer Account</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Create your personalized agricultural advisory profile.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ramesh Kumar"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ramesh123"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="ramesh@gmail.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="9876543210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    className="form-select"
                    value={registerForm.state}
                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Bihar">Bihar</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ludhiana / Guntur"
                    value={registerForm.district}
                    onChange={(e) => setRegisterForm({ ...registerForm, district: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration →'}
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
