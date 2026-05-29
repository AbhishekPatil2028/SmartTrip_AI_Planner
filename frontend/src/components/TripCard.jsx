import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trash2, ArrowRight, DollarSign } from 'lucide-react';

const TripCard = ({ itinerary, onDelete }) => {
  const navigate = useNavigate();
  const { _id, title, destination, startDate, endDate, summary, estimatedBudget, days } = itinerary;

  const formatDateRange = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const options = { month: 'short', day: 'numeric' };
      
      if (start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
      }
      return `${start.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    } catch {
      return 'Dates N/A';
    }
  };

  const durationDays = days?.length || 0;

  const handleCardClick = () => {
    navigate(`/itinerary/${_id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Avoid navigating to detailed view
    if (window.confirm(`Are you sure you want to delete your trip to "${destination}"?`)) {
      onDelete(_id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card"
      style={{
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Dynamic glow overlay */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Destination & Location Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary-light)' }}>
            <MapPin size={14} />
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {destination}
            </span>
          </div>

          {/* Delete Action Icon */}
          {onDelete && (
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
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
              title="Delete trip plan"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{title}</h3>
      </div>

      {/* Description Snippet */}
      {summary && (
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          height: '58px', // Fixed height for alignment grid uniformity
        }}>
          {summary}
        </p>
      )}

      {/* Footer Details Grid */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '14px',
        marginTop: 'auto',
      }}>
        {/* Date Ranges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{formatDateRange()}</span>
        </div>

        {/* Duration Days Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {estimatedBudget && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--color-secondary-light)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}>
              {estimatedBudget}
            </span>
          )}

          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            background: 'rgba(139, 92, 246, 0.12)',
            color: 'var(--color-primary-light)',
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
