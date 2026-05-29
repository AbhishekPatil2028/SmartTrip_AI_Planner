import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../context/AuthContext';
import Timeline from '../components/Timeline';
import Loader from '../components/Loader';
import { 
  Calendar, MapPin, Printer, CalendarPlus, CheckSquare, 
  Lightbulb, Check, ChevronRight, Compass, Copy, ArrowRight, DollarSign, ListTodo, Plus 
} from 'lucide-react';

const SharedItineraryPage = () => {
  const { shareId } = useParams();
  const { user, getHeaders } = useAuth();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDayTab, setSelectedDayTab] = useState(0);
  const [activeSideTab, setActiveSideTab] = useState('packing');
  
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const fetchSharedItinerary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/shared/${shareId}`);
      const data = await response.json();
      
      if (data.success) {
        setItinerary(data.itinerary);
      } else {
        setError(data.message || 'Shared itinerary not found or is no longer public.');
      }
    } catch (err) {
      setError('Connection to travel server failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareId) {
      fetchSharedItinerary();
    }
  }, [shareId]);

  // NATIVE CLIENT-SIDE ICS CALENDAR GENERATOR FOR PUBLIC USERS
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

  // CLONE AND IMPORT FLOW
  const handleImportItinerary = async () => {
    if (!user) {
      // Redirect to sign in/up page first if anonymous
      alert('Please log in or register a free account to copy this trip planning timeline!');
      navigate('/login', { state: { isSignUp: true } });
      return;
    }

    setImportLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/itineraries/shared/${shareId}/import`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        setImportSuccess(true);
        setTimeout(() => {
          navigate(`/itinerary/${data.itinerary._id}`);
        }, 1500);
      } else {
        alert(data.message || 'Failed to clone itinerary.');
      }
    } catch (err) {
      alert('Error connecting to backend database.');
    } finally {
      setImportLoading(false);
    }
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

  if (loading) {
    return <Loader message="Accessing Public Itinerary..." />;
  }

  if (error || !itinerary) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <h2 style={{ color: '#fda4af', marginBottom: '12px' }}>Trip Plan Unavailable</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'This itinerary is no longer shared publicly.'}</p>
          <Link to="/" className="btn-premium">Go to SmartTrip Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Background Orbs */}
      <div className="glow-orb orb-cyan" style={{ top: '20%', right: '15%' }} />

      {/* Floating Marketing Conversion Banner */}
      <div className="glass-panel no-print" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px',
        background: 'rgba(139, 92, 246, 0.15)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            padding: '12px',
            borderRadius: '12px',
            color: 'white',
          }}>
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>
              SmartTrip AI Travel Showcase
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Like this itinerary? Save a fully editable copy directly into your own account!
            </p>
          </div>
        </div>

        <button 
          onClick={handleImportItinerary}
          disabled={importLoading || importSuccess}
          className="btn-premium btn-cyan"
          style={{ padding: '10px 22px', fontSize: '14px' }}
        >
          {importLoading ? (
            'Copying...'
          ) : importSuccess ? (
            <>
              <Check size={16} /> Cloned!
            </>
          ) : (
            <>
              <Plus size={16} /> Save to My Dashboard
            </>
          )}
        </button>
      </div>

      {/* Header Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginBottom: '40px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '750px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary-light)' }}>
              <MapPin size={16} />
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Shared Travel Plan
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'white' }}>{itinerary.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{itinerary.summary}</p>
          </div>

          {/* Action exporters */}
          <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleExportToCalendar} className="btn-premium-secondary" title="Export schedule">
              <CalendarPlus size={16} />
              <span>Calendar</span>
            </button>

            <button onClick={() => window.print()} className="btn-premium-secondary" title="Print to PDF">
              <Printer size={16} />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Quick parameters summary bar */}
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

      {/* Main Dual Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '40px',
        alignItems: 'start',
      }} className="print-single-column">
        {/* Timeline lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Day selectors */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
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

          <div>
            {selectedDayTab === -1 ? (
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
              <Timeline 
                activities={itinerary.days[selectedDayTab]?.activities || []} 
                bookings={itinerary.bookings} 
              />
            )}
          </div>
        </div>

        {/* Right side Panel Checklist/Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="no-print">
          <div className="glass-panel" style={{ padding: '24px' }}>
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

            {activeSideTab === 'packing' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.packingList?.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    No packing items suggested.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                    {itinerary.packingList?.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{ fontSize: '13px', color: 'white' }}>{item.item}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
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
    </div>
  );
};

export default SharedItineraryPage;
