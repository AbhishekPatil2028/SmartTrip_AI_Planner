import React from 'react';
import { MapPin, Clock, Plane, Hotel, Train, Utensils, Compass, Eye, ShieldAlert, Sparkles } from 'lucide-react';

const Timeline = ({ activities = [], bookings = [] }) => {
  
  const getActivityIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'flight':
        return <Plane size={14} color="white" />;
      case 'hotel':
        return <Hotel size={14} color="white" />;
      case 'train':
        return <Train size={14} color="white" />;
      case 'dining':
      case 'food':
      case 'restaurant':
        return <Utensils size={14} color="white" />;
      case 'transit':
      case 'taxi':
      case 'subway':
        return <Clock size={14} color="white" />;
      default:
        return <Compass size={14} color="white" />;
    }
  };

  const getTimelineDotClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'flight':
      case 'train':
        return 'accent'; // Pink glow
      case 'hotel':
        return 'cyan'; // Cyan glow
      default:
        return ''; // Purple glow
    }
  };

  return (
    <div className="timeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {activities.map((activity, idx) => {
        const { timeSlot, activityTitle, description, location, category, bookingRefIndex } = activity;
        const dotClass = getTimelineDotClass(category);
        
        // Find linked ticket if index reference is provided
        const linkedBooking = bookingRefIndex !== undefined && bookingRefIndex !== null && bookings[bookingRefIndex]
          ? bookings[bookingRefIndex]
          : null;

        return (
          <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Timeline Ring Dot */}
            <div className={`timeline-dot ${dotClass}`} style={{ top: '4px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'white',
              }} />
            </div>

            {/* Time Slot Badge & Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Clock size={10} />
                {timeSlot}
              </span>

              {category && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: dotClass === 'cyan' ? 'rgba(6, 182, 212, 0.1)' : dotClass === 'accent' ? 'rgba(244, 114, 182, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                  border: dotClass === 'cyan' ? '1px solid rgba(6, 182, 212, 0.2)' : dotClass === 'accent' ? '1px solid rgba(244, 114, 182, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)',
                  color: dotClass === 'cyan' ? 'var(--color-secondary-light)' : dotClass === 'accent' ? '#f472b6' : 'var(--color-primary-light)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {getActivityIcon(category)}
                  {category}
                </span>
              )}

              {/* Linked ticket reference indicator tag */}
              {linkedBooking && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Sparkles size={10} />
                  Linked to Ticket
                </span>
              )}
            </div>

            {/* Activity Card */}
            <div className="glass-card" style={{
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>{activityTitle}</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
              </div>

              {location && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                }}>
                  <MapPin size={13} color="var(--color-secondary-light)" style={{ flexShrink: 0 }} />
                  <span>{location}</span>
                </div>
              )}

              {/* Collapsed view of the original ticket details within the activity! */}
              {linkedBooking && (
                <div style={{
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  fontSize: '12px',
                }}>
                  <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    Linked Booking Details:
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong>{linkedBooking.title}</strong> ({linkedBooking.provider})
                  </div>
                  {linkedBooking.confirmationNumber && (
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      Confirmation #: <code style={{ color: 'white', background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: '3px' }}>{linkedBooking.confirmationNumber}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
