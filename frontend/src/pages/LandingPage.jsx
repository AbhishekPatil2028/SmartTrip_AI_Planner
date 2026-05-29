import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, FileUp, Share2, Calendar, FileText, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 100px)' }}>
      {/* Background Orbs */}
      <div className="glow-orb orb-purple" />
      <div className="glow-orb orb-cyan" />

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 100px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '32px'
      }}>
        {/* Shiny Feature Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          color: 'var(--color-primary-light)',
          padding: '6px 16px',
          borderRadius: '99px',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)'
        }}>
          <Sparkles size={14} />
          <span>Introducing SmartTrip AI Itinerary Generator</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 68px)',
          fontWeight: 900,
          lineHeight: '1.1',
          maxWidth: '900px',
          background: 'linear-gradient(to bottom, #ffffff 30%, #e2e8f0 70%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em'
        }}>
          Transform Your Travel Bookings Into a{' '}
          <span style={{
            background: 'linear-gradient(to right, var(--color-secondary), var(--color-primary-light), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Cohesive AI Itinerary
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 19px)',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          lineHeight: '1.6'
        }}>
          Stop copy-pasting booking details. Upload your flight tickets, hotel reservations, or travel PDFs and let our AI assemble a beautiful daily vacation roadmap instantly.
        </p>

        {/* Hero Actions */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
          {user ? (
            <Link to="/planner" className="btn-premium btn-cyan" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Create a Trip Plan <ChevronRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-premium" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Get Started for Free <ChevronRight size={18} />
              </Link>
              <Link to="/login" state={{ isSignUp: false }} className="btn-premium-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Visual Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '1050px',
          marginTop: '60px'
        }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)'
            }}>
              <FileUp size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Instant Ticket Upload</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Drag and drop PDF tickets, boarding passes, or hotel confirmation screenshots. Our AI extracts routes, reference codes, and times in seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-light)'
            }}>
              <Compass size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>AI Travel Synthesis</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Our system blends flight arrivals, check-in dates, and train connections into a highly structured day-by-day vacation roadmap with custom sightseeing recommendations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(244, 114, 182, 0.1)',
              border: '1px solid rgba(244, 114, 182, 0.2)',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f472b6'
            }}>
              <Share2 size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Bespoke Share Experience</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Publish itineraries to create custom public read-only pages. Export schedules to standard `.ics` calendar files or download beautifully formatted physical print PDFs.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Proof Promo Panel */}
      <section className="glass-panel" style={{
        maxWidth: '1050px',
        margin: '0 auto 80px auto',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '32px',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        background: 'rgba(20, 24, 41, 0.45)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Are you ready to plan smarter?</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Join thousands of travelers who use AI to skip the tedious formatting and get straight to exploring the world. Start building your perfect itinerary.
          </p>
        </div>
        
        {user ? (
          <Link to="/planner" className="btn-premium btn-cyan" style={{ padding: '12px 28px' }}>
            Enter Travel Desk
          </Link>
        ) : (
          <Link to="/login" state={{ isSignUp: true }} className="btn-premium" style={{ padding: '12px 28px' }}>
            Register Now
          </Link>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
