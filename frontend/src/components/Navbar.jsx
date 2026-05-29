import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, Settings, Key, User, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout, apiKey, saveApiKey } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    saveApiKey(tempKey);
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="glass-panel no-print" style={{
        margin: '16px 24px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '16px',
        zIndex: 100,
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
          }}>
            <Compass size={22} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff, #d8b4fe, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SmartTrip AI
          </span>
        </Link>

        {/* Desktop Navigation Link Items */}
        <div className="no-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'var(--transition-fast)',
                background: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isActive('/dashboard') ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              }}>
                Dashboard
              </Link>
              <Link to="/planner" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'var(--transition-fast)',
                background: isActive('/planner') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isActive('/planner') ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              }}>
                Plan New Trip
              </Link>
              
              <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
              


              {/* Settings Action Button */}
              <button 
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'var(--transition-fast)'
                }}
                className="hover-glow"
              >
                <Settings size={18} />
              </button>

              {/* Username Profile Tag */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#d8b4fe'
              }}>
                <User size={14} />
                <span>{user.username}</span>
              </div>

              {/* Logout button */}
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => e.target.style.color = '#fda4af'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'var(--transition-fast)'
              }}>
                Sign In
              </Link>
              <Link to="/login" state={{ isSignUp: true }} className="btn-premium" style={{
                padding: '8px 18px',
                fontSize: '14px',
                borderRadius: '8px',
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className="only-mobile"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Content Panel */}
      {isMobileMenuOpen && (
        <div className="glass-card only-mobile" style={{
          margin: '-8px 24px 16px 24px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 99,
          position: 'relative'
        }}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '8px', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/planner" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '8px', fontWeight: 500 }}>Plan New Trip</Link>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsDrawerOpen(true); }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <Settings size={16} />
                <span>AI Configuration</span>
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  color: '#fda4af',
                  padding: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <LogOut size={16} />
                <span>Logout ({user.username})</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '8px', textAlign: 'center' }}>Sign In</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} state={{ isSignUp: true }} className="btn-premium" style={{ width: '100%', textAlign: 'center', padding: '10px 0' }}>Get Started</Link>
            </>
          )}
        </div>
      )}

      {/* Dynamic API Configuration Settings Drawer (Overlay modal) */}
      {isDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            background: 'var(--bg-card-glass)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 0 50px rgba(139, 92, 246, 0.15)'
          }}>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Key size={24} color="var(--color-secondary)" />
              <h3 style={{ fontSize: '20px' }}>AI Configuration</h3>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: '1.5',
              color: '#86efac',
              marginBottom: '16px'
            }}>
              ✅ <strong>Server key active:</strong> SmartTrip AI already has a built-in API key. You can start using the app immediately without providing your own.
            </div>

            <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
              <strong>Optional:</strong> Provide your own Gemini API key below if you encounter quota limits or want to use your personal key instead.
            </p>

            <form onSubmit={handleSaveKey} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>GEMINI API KEY (OPTIONAL)</label>
                <input 
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Leave empty to use server default..."
                  className="input-glass"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                lineHeight: '1.5',
                color: 'var(--text-muted)'
              }}>
                💡 <strong>Privacy Note:</strong> Your API key is stored locally in your browser and never sent to any third party. If left empty, the server's built-in key is used automatically.
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-premium-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-premium btn-cyan"
                  style={{ flex: 1 }}
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
