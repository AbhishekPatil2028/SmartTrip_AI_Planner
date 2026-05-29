import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Read toggle state passed from Landing page
  useEffect(() => {
    if (location.state && location.state.isSignUp !== undefined) {
      setIsSignUp(location.state.isSignUp);
    }
  }, [location]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (isSignUp && !username)) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setAuthLoading(true);

    try {
      if (isSignUp) {
        const result = await register(username, email, password);
        if (!result.success) {
          setError(result.message || 'Registration failed');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.message || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check if backend is running.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Background Glows */}
      <div className="glow-orb orb-purple" style={{ top: '20%', left: '30%' }} />

      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.05)',
      }}>
        {/* Brand Icon Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          }}>
            <Compass size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {isSignUp ? 'Sign up to start planning your next escape' : 'Access your customized travel planners'}
          </p>
        </div>

        {/* Tab system selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            style={{
              padding: '10px 0',
              border: 'none',
              background: !isSignUp ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: !isSignUp ? 'white' : 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            style={{
              padding: '10px 0',
              border: 'none',
              background: isSignUp ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: isSignUp ? 'white' : 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            color: '#fda4af',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13.5px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {isSignUp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. wanderlust_traveller"
                  className="input-glass"
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-glass"
                style={{ width: '100%', paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-glass"
                style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '15px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="btn-premium"
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
          >
            {authLoading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
