import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../context/AuthContext';
import TripCard from '../components/TripCard';
import Loader from '../components/Loader';
import { Plus, Compass, Calendar, Globe, AlertCircle, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const { token, getHeaders } = useAuth();
  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalTrips: 0, destinations: 0, daysCount: 0 });

  const fetchItineraries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setItineraries(data.itineraries);
        calculateStats(data.itineraries);
      } else {
        setError(data.message || 'Failed to fetch itineraries.');
      }
    } catch (err) {
      setError('Connection to backend failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItineraries();
    }
  }, [token]);

  const calculateStats = (trips) => {
    const totalTrips = trips.length;
    
    // Count unique destinations
    const uniqueDests = new Set(trips.map((t) => t.destination.split(',')[0].trim()));
    
    // Count total days
    const totalDays = trips.reduce((acc, t) => acc + (t.days?.length || 0), 0);

    setStats({
      totalTrips,
      destinations: uniqueDests.size,
      daysCount: totalDays,
    });
  };

  const handleDeleteItinerary = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        const filtered = itineraries.filter((item) => item._id !== id);
        setItineraries(filtered);
        calculateStats(filtered);
      } else {
        alert(data.message || 'Failed to delete itinerary');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    }
  };

  if (loading) {
    return <Loader message="Accessing Your Travel Log..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Background Orbs */}
      <div className="glow-orb orb-purple" style={{ top: '10%', left: '40%' }} />

      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>Your Travel Desk</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Organize, view, and share your AI-powered travel itineraries</p>
        </div>

        <Link to="/planner" className="btn-premium btn-cyan">
          <Plus size={18} />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="glass-card" style={{
          padding: '16px 20px',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          color: '#fda4af',
          fontSize: '14.5px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchItineraries}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Stats Summary Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '48px',
      }}>
        {/* Stat Item 1 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '14px',
            borderRadius: '12px',
            color: 'var(--color-primary-light)',
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>{stats.totalTrips}</h4>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Total Journeys Planned</span>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '14px',
            borderRadius: '12px',
            color: 'var(--color-secondary-light)',
          }}>
            <Globe size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>{stats.destinations}</h4>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Unique Locations</span>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'rgba(244, 114, 182, 0.1)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f472b6',
          }}>
            <Compass size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>{stats.daysCount}</h4>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Total Vacation Days</span>
          </div>
        </div>
      </div>

      {/* Main Grid Log */}
      {itineraries.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '20px',
            borderRadius: '50%',
            color: 'var(--text-muted)',
            display: 'inline-flex',
          }}>
            <Compass size={40} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>No Itineraries Found</h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              Create your very first travel plan! Upload your flight and hotel bookings to let our AI build your schedule.
            </p>
          </div>
          <Link to="/planner" className="btn-premium" style={{ marginTop: '8px' }}>
            <Plus size={18} />
            <span>Generate Itinerary</span>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {/* Historical Items */}
          {itineraries.map((itinerary) => (
            <TripCard
              key={itinerary._id}
              itinerary={itinerary}
              onDelete={handleDeleteItinerary}
            />
          ))}

          {/* Quick Create Card Grid Slot */}
          <Link
            to="/planner"
            className="glass-card"
            style={{
              minHeight: '220px',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '24px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '12px',
              borderRadius: '50%',
              color: 'var(--text-muted)',
            }}>
              <Plus size={24} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>Add New Trip Plan</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
