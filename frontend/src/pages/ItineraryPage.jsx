import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../context/AuthContext';
import Timeline from '../components/Timeline';
import Loader from '../components/Loader';
import { 
  Calendar, MapPin, Share2, Printer, CalendarPlus, CheckSquare, 
  Lightbulb, Copy, Check, ChevronLeft, ArrowRight, DollarSign, ListTodo 
} from 'lucide-react';

const ItineraryPage = () => {
  const { id } = useParams();
  const { getHeaders } = useAuth();
  
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDayTab, setSelectedDayTab] = useState(0); // 0 corresponds to Day 1, -1 corresponds to All Days
  const [activeSideTab, setActiveSideTab] = useState('packing'); // 'packing' or 'tips'
  const [packingList, setPackingList] = useState([]);
  
  const [isCopied, setIsCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const fetchItinerary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/${id}`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setItinerary(data.itinerary);
        setPackingList(data.itinerary.packingList || []);
      } else {
        setError(data.message || 'Failed to fetch itinerary details.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const handleToggleShare = async () => {
    setShareLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/${id}/share`, {
        method: 'PATCH',
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setItinerary((prev) => ({
          ...prev,
          isShared: data.isShared,
          shareId: data.shareId,
        }));
      } else {
        alert('Failed to update share status');
      }
    } catch (err) {
      alert('Error updating share status');
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!itinerary || !itinerary.shareId) return;
    const shareUrl = `${window.location.origin}/share/itinerary/${itinerary.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Toggle checklist item packed status in frontend local state
  const handleTogglePacked = (index) => {
    setPackingList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, packed: !item.packed } : item))
    );
  };

  const formatDateRange = () => {
    if (!itinerary) return '';
    try {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    } catch {
      return '';
    }
  };

  // NATIVE CLIENT-SIDE ICS CALENDAR GENERATION
  const handleExportToCalendar = () => {
    if (!itinerary) return;

    let icsContent = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SmartTrip AI//NONSGML Itinerary//EN\r\n';

    itinerary.days.forEach((day) => {
      const dateStr = new Date(day.date).toISOString().split('T')[0].replace(/-/g, '');

      day.activities.forEach((activity) => {
        let startHour = '09';
        let endHour = '12';

        if (activity.timeSlot === 'Afternoon') {
          startHour = '13';
          endHour = '17';
        } else if (activity.timeSlot === 'Evening') {
          startHour = '18';
          endHour = '22';
        }

        icsContent += 'BEGIN:VEVENT\r\n';
        icsContent += `DTSTART:${dateStr}T${startHour}0000Z\r\n`;
        icsContent += `DTEND:${dateStr}T${endHour}0000Z\r\n`;
        icsContent += `SUMMARY:${activity.activityTitle} - ${itinerary.destination}\r\n`;
        icsContent += `DESCRIPTION:${activity.description.replace(/\n/g, '\\n')}\r\n`;
        if (activity.location) {
          icsContent += `LOCATION:${activity.location}\r\n`;
        }
        icsContent += 'END:VEVENT\r\n';
      });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${itinerary.title.replace(/\s+/g, '_')}_Calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Loader message="Rendering Trip Timeline..." />;
  }

  if (error || !itinerary) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <h2 style={{ color: '#fda4af', marginBottom: '12px' }}>Oops! Error Loading Itinerary</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Itinerary could not be loaded.'}</p>
          <Link to="/dashboard" className="btn-premium btn-cyan">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Background Orbs */}
      <div className="glow-orb orb-purple" style={{ top: '15%', left: '30%' }} />

      {/* Back Button */}
      <Link to="/dashboard" className="no-print" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '14px',
        marginBottom: '24px',
        fontWeight: 500,
        transition: 'var(--transition-fast)',
      }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      {/* Main Header Display Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {/* Title and Dates Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary-light)' }}>
              <MapPin size={16} />
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {itinerary.destination}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'white' }}>{itinerary.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{itinerary.summary}</p>
          </div>

          {/* Action Row Widgets */}
          <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Calendar Exporter */}
            <button onClick={handleExportToCalendar} className="btn-premium-secondary" title="Export schedule to calendar">
              <CalendarPlus size={16} />
              <span>Calendar</span>
            </button>

            {/* Print trigger */}
            <button onClick={() => window.print()} className="btn-premium-secondary" title="Print itinerary to PDF">
              <Printer size={16} />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Quick details summary row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '13.5px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '12px 20px',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Calendar size={14} color="var(--color-primary-light)" />
            <strong>Dates:</strong> <span>{formatDateRange()}</span>
          </div>

          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <ListTodo size={14} color="var(--color-secondary-light)" />
            <strong>Duration:</strong> <span>{itinerary.days?.length} {itinerary.days?.length === 1 ? 'Day' : 'Days'}</span>
          </div>

          {itinerary.estimatedBudget && (
            <>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                <DollarSign size={14} color="#f472b6" />
                <strong>Estimated Budget:</strong> <span>{itinerary.estimatedBudget}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Dual Grid Layout: Timeline Left, Sharing/Checklist Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '40px',
        alignItems: 'start',
      }} className="print-single-column">
        {/* Left Side: Interactive Timelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Day Selector Buttons */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            {/* All Days Tab */}
            <button
              onClick={() => setSelectedDayTab(-1)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: selectedDayTab === -1 ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' : 'rgba(255, 255, 255, 0.03)',
                color: 'white',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: selectedDayTab === -1 ? 'var(--shadow-glow)' : 'none',
                transition: 'var(--transition-fast)',
                flexShrink: 0,
              }}
            >
              All Days View
            </button>

            {itinerary.days?.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayTab(idx)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedDayTab === idx ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: selectedDayTab === idx ? 'var(--shadow-glow)' : 'none',
                  transition: 'var(--transition-fast)',
                  flexShrink: 0,
                }}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Timeline Execution Render */}
          <div>
            {selectedDayTab === -1 ? (
              // Print all days consecutively
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {itinerary.days?.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      color: 'var(--color-secondary-light)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🗓️ Day {day.dayNumber} — {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                    <Timeline activities={day.activities} bookings={itinerary.bookings} />
                  </div>
                ))}
              </div>
            ) : (
              // Show selected day only
              <Timeline 
                activities={itinerary.days[selectedDayTab]?.activities || []} 
                bookings={itinerary.bookings} 
              />
            )}
          </div>
        </div>

        {/* Right Side Panel: Sharing details + Checklist/Local Tips widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="no-print">
          
          {/* Share Itinerary Drawer Box */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Share2 size={18} color="var(--color-primary-light)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>Public Share Panel</h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
              Toggle sharing on to create a public, read-only dashboard link to share with travel partners.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {itinerary.isShared ? '🟢 Share Link Active' : '🔴 Private Itinerary'}
              </span>

              {/* Slider switch button */}
              <button 
                onClick={handleToggleShare}
                disabled={shareLoading}
                style={{
                  background: itinerary.isShared ? 'var(--color-secondary)' : 'rgba(255,255,255,0.06)',
                  width: '46px',
                  height: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: itinerary.isShared ? '24px' : '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'var(--transition-smooth)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>

            {/* Display sharing copy input links */}
            {itinerary.isShared && itinerary.shareId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/share/itinerary/${itinerary.shareId}`}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      padding: '8px 10px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      background: isCopied ? 'var(--color-secondary)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-secondary-light)', fontWeight: 500 }}>
                  {isCopied ? 'Copied link to clipboard!' : 'Click to copy public link'}
                </span>
              </div>
            )}
          </div>

          {/* Packing checklist / Travel Tips Panel Drawer */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            {/* Tab Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '20px',
            }}>
              <button
                onClick={() => setActiveSideTab('packing')}
                style={{
                  padding: '8px 0',
                  border: 'none',
                  background: activeSideTab === 'packing' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: activeSideTab === 'packing' ? 'white' : 'var(--text-muted)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <CheckSquare size={13} />
                <span>Packing list</span>
              </button>
              <button
                onClick={() => setActiveSideTab('tips')}
                style={{
                  padding: '8px 0',
                  border: 'none',
                  background: activeSideTab === 'tips' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: activeSideTab === 'tips' ? 'white' : 'var(--text-muted)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Lightbulb size={13} />
                <span>Local Tips</span>
              </button>
            </div>

            {/* Render Packing checklist content */}
            {activeSideTab === 'packing' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {packingList.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    No packing items suggested.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                    {packingList.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleTogglePacked(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: item.packed ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)',
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: item.packed ? '1px solid var(--color-secondary)' : '1px solid var(--text-muted)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: item.packed ? 'var(--color-secondary)' : 'transparent',
                          transition: 'var(--transition-fast)',
                        }}>
                          {item.packed && <Check size={11} color="black" strokeWidth={3} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{
                            fontSize: '13px',
                            color: item.packed ? 'var(--text-muted)' : 'white',
                            textDecoration: item.packed ? 'line-through' : 'none',
                          }}>
                            {item.item}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Render AI Travel Tips content
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {itinerary.tips?.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    No local tips generated.
                  </p>
                ) : (
                  itinerary.tips?.map((tip, idx) => (
                    <div key={idx} style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--color-secondary-light)', marginBottom: '4px' }}>
                        💡 {tip.title}
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{tip.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media query styling print overrides */}
      <style>{`
        @media (max-width: 768px) {
          .print-single-column {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ItineraryPage;
