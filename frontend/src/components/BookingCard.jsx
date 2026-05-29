import React from 'react';
import { Plane, Hotel, Train, Car, FileText, Trash2, Calendar, Clock, Bookmark } from 'lucide-react';

const BookingCard = ({ booking, onRemove, index }) => {
  const {
    category,
    title,
    confirmationNumber,
    startDate,
    endDate,
    startTime,
    endTime,
    origin,
    destination,
    provider,
    notes,
  } = booking;

  // Select icon based on Category
  const getCategoryIcon = () => {
    switch (category) {
      case 'flight':
        return <Plane size={20} color="var(--color-primary-light)" />;
      case 'hotel':
        return <Hotel size={20} color="var(--color-secondary-light)" />;
      case 'train':
        return <Train size={20} color="#f472b6" />;
      case 'car_rental':
        return <Car size={20} color="#fbbf24" />;
      default:
        return <FileText size={20} color="var(--text-muted)" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`glass-card ${category === 'hotel' ? 'glass-card-glow-cyan' : ''}`} style={{
      padding: '20px',
      position: 'relative',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {getCategoryIcon()}
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{title || `${(category || 'other').toUpperCase()} Reservation`}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{provider || 'Unidentified Provider'}</span>
          </div>
        </div>

        {/* Delete Hook Button */}
        {onRemove && (
          <button
            onClick={() => onRemove(index)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#f43f5e';
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
            title="Delete this ticket"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Booking Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        fontSize: '13px',
        background: 'rgba(0, 0, 0, 0.15)',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.03)',
      }}>
        {/* Dates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
            {category === 'hotel' ? 'Check-In' : 'Start Date'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Calendar size={13} style={{ flexShrink: 0 }} />
            <span>{formatDate(startDate)}</span>
          </div>
        </div>

        {category === 'hotel' && endDate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Check-Out
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Calendar size={13} style={{ flexShrink: 0 }} />
              <span>{formatDate(endDate)}</span>
            </div>
          </div>
        )}

        {/* Departure/Arrival info */}
        {origin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Origin
            </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{origin}</span>
          </div>
        )}

        {destination && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              {category === 'hotel' ? 'Location' : 'Destination'}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{destination}</span>
          </div>
        )}

        {/* Times */}
        {startTime && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Departure Time
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Clock size={13} />
              <span>{startTime}</span>
            </div>
          </div>
        )}

        {endTime && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Arrival Time
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Clock size={13} />
              <span>{endTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
        {confirmationNumber && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bookmark size={13} color="var(--color-secondary)" />
            <span style={{ color: 'var(--text-muted)' }}>Confirm #:</span>
            <code style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '12px',
              fontWeight: 600,
            }}>{confirmationNumber}</code>
          </div>
        )}

        {notes && (
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
            paddingLeft: '8px',
            fontStyle: 'italic',
            lineHeight: '1.4',
          }}>
            {notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
