import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import Loader from '../components/Loader';
import { FileUp, Calendar, MapPin, Sparkles, AlertCircle, Plus } from 'lucide-react';

const PlannerPage = () => {
  const { getHeaders, apiKey, openSettings } = useAuth();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Drag handers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  // Upload file and extract details via backend + Gemini
  const handleFileUpload = async (file) => {
    setError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF or an Image (PNG, JPG).');
      return;
    }

    setLoadingMessage('De-routing travel document texts...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/upload/document`, {
        method: 'POST',
        headers: getHeaders(true), // true indicates multipart (excludes Content-Type so boundary is set automatically)
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setBookings((prev) => [...prev, data.booking]);
        
        // Proactively auto-populate dates and destinations if found and empty!
        if (data.booking.startDate && !startDate) {
          setStartDate(data.booking.startDate.split('T')[0]);
        }
        if (data.booking.endDate && !endDate) {
          setEndDate(data.booking.endDate.split('T')[0]);
        }
        if (data.booking.destination && !destination) {
          setDestination(data.booking.destination);
        }
      } else {
        if (response.status === 429 || data.isQuotaExceeded) {
          setError({
            message: 'The shared server key has temporarily reached its Google free-tier quota limit.',
            isQuota: true
          });
        } else {
          setError(data.message || 'Failed to extract booking details.');
        }
      }
    } catch (err) {
      setError('Communication with AI parsing engine failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBooking = (indexToRemove) => {
    setBookings((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Compile and trigger AI daily synthesis
  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setError('');

    if (!destination) {
      setError('Please provide a destination (e.g. Rome, Italy)');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please specify the start and end dates for your trip');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setError('End date cannot be earlier than start date');
      return;
    }

    setLoadingMessage('Blending tickets & drafting your daily escape...');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          bookings,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to visual itinerary view page
        navigate(`/itinerary/${data.itinerary._id}`);
      } else {
        if (response.status === 429 || data.isQuotaExceeded) {
          setError({
            message: 'The shared server key has temporarily reached its Google free-tier quota limit.',
            isQuota: true
          });
        } else {
          setError(data.message || 'Itinerary generation failed.');
        }
      }
    } catch (err) {
      setError('Connection failed while generating itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Background Orbs */}
      <div className="glow-orb orb-cyan" style={{ bottom: '10%', left: '5%' }} />
      <div className="glow-orb orb-purple" style={{ top: '20%', right: '10%' }} />

      {loading && <Loader message={loadingMessage} />}

      {/* Header Banner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>Plan Your Adventure</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          Upload booking tickets and let AI stitch them into an interactive day-by-day vacation roadmap.
        </p>
      </div>

      {/* Friendly info banner about API key being optional */}
      {!apiKey && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          background: 'rgba(34, 197, 94, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#86efac',
          fontSize: '13.5px',
          marginBottom: '32px',
        }}>
          <Sparkles size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Ready to go!</strong> SmartTrip AI uses a built-in server key. 
            Want to use your own Gemini key? Open <strong>Settings (⚙️)</strong> in the navbar — it's optional.
          </div>
        </div>
      )}

      {/* Error State Banner */}
      {error && (
        typeof error === 'object' && error.isQuota ? (
          <div className="glass-card" style={{
            padding: '24px 32px',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            background: 'rgba(239, 68, 68, 0.04)',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={24} color="#f87171" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f87171', margin: 0 }}>
                  Server Quota Exceeded (429)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  The shared server-level API key has temporarily reached its Google Gemini free-tier quota limit. 
                  To continue immediately, please provide your own free Gemini API key (it takes less than 30 seconds to get one).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
              <button 
                onClick={openSettings}
                className="btn-premium btn-cyan"
                style={{ 
                  padding: '10px 20px', 
                  fontSize: '13.5px', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={15} />
                <span>Enter Your Free API Key</span>
              </button>

              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  fontSize: '13.5px',
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => e.target.style.color = '#a78bfa'}
                onMouseOut={(e) => e.target.style.color = 'var(--color-secondary)'}
              >
                Get a free Gemini Key from Google AI Studio →
              </a>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{
            padding: '16px 20px',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fda4af',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{typeof error === 'object' ? error.message : error}</span>
          </div>
        )
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start',
      }}>
        {/* Left Side: Trip Details Form & File Dropzone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <form onSubmit={handleGenerateItinerary} className="glass-panel" style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Trip Details</h3>

            {/* Destination Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Destination</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Rome, Italy"
                  className="input-glass"
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {/* Date Picker Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-glass"
                    style={{ width: '100%', paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>End Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-glass"
                    style={{ width: '100%', paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="submit"
              className="btn-premium"
              style={{ width: '100%', marginTop: '12px', padding: '14px' }}
            >
              <Sparkles size={18} />
              <span>Generate AI Itinerary</span>
            </button>
          </form>

          {/* Ticket File Drag and Drop zone */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Upload Documents</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.4' }}>
              Drag-and-drop travel documents to auto-populate dates and link bookings directly to days.
            </p>

            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={false}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept=".pdf,image/png,image/jpeg,image/jpg"
              />
              
              <FileUp size={36} color={dragActive ? 'var(--color-secondary)' : 'var(--text-muted)'} style={{ marginBottom: '14px', transition: 'var(--transition-fast)' }} />
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                Drag & Drop Booking Document
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Supports PDF, PNG, JPG, JPEG (Max 10MB)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Extracted Booking Cards List Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
              Extracted Bookings ({bookings.length})
            </h3>
            {bookings.length > 0 && (
              <span style={{
                fontSize: '11px',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 8px',
                borderRadius: '4px',
                color: 'var(--text-muted)'
              }}>
                Ready to merge
              </span>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="glass-panel" style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              border: '1px dashed rgba(255,255,255,0.08)',
              background: 'transparent',
              minHeight: '380px',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '16px',
                borderRadius: '50%',
                color: 'var(--text-muted)',
              }}>
                <FileUp size={24} />
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: '1.5' }}>
                No travel bookings uploaded yet. Drop tickets here to enrich your itinerary timeline!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '660px', overflowY: 'auto', paddingRight: '8px' }}>
              {bookings.map((booking, index) => (
                <BookingCard
                  key={index}
                  index={index}
                  booking={booking}
                  onRemove={handleRemoveBooking}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
