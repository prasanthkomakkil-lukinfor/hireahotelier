import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, SHADOWS } from '../../tokens';
import { GoldBtn, OutlineBtn } from '../ui/index';

const NAV_LINKS = [
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/jobs?type=part-time', label: '⚡ Part-Time Shifts' },
  { to: '/for-employers', label: 'For Employers' },
  { to: '/about', label: 'About' },
];

export default function TopNav() {
  const { currentUser, userProfile, logout, isSeeker, isEmployer } = useAuth();
  const { isMobile } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardLink = isSeeker ? '/candidate/dashboard' : isEmployer ? '/employer/dashboard' : '/';

  return (
    <>
      <nav style={{
        background: C.navy, padding: isMobile ? '12px 16px' : '13px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: SHADOWS.navy,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
            borderRadius: 9, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🏨</div>
          <div>
            <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: isMobile ? 15 : 18, fontWeight: 700, lineHeight: 1 }}>HireAHotelier</div>
            <div style={{ color: C.muted, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body }}>.com</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: location.pathname === l.to.split('?')[0] ? C.gold : '#CBD5E1',
                fontSize: 13, textDecoration: 'none', fontFamily: FONTS.body,
                fontWeight: location.pathname === l.to.split('?')[0] ? 700 : 400,
              }}>{l.label}</Link>
            ))}
          </div>
        )}

        {/* Auth actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {currentUser ? (
            /* ── Logged in ── */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.15)`,
                  borderRadius: 40, padding: '5px 10px 5px 5px',
                  cursor: 'pointer', color: 'white', fontFamily: FONTS.body, fontSize: 13,
                }}
              >
                <div style={{
                  width: 28, height: 28, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (isEmployer ? '🏨' : '👤')}
                </div>
                {!isMobile && <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userProfile?.displayName?.split(' ')[0] || 'My Account'}
                </span>}
                <span style={{ fontSize: 10, color: C.muted }}>▼</span>
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: C.white, border: `1.5px solid ${C.border}`,
                  borderRadius: 12, minWidth: 200, boxShadow: SHADOWS.lg, zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, background: C.slate }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{userProfile?.displayName}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: FONTS.body }}>{userProfile?.email || currentUser.email}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ background: C.amberBg, color: C.amberText, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: FONTS.body }}>
                        {isSeeker ? '👤 Job Seeker' : '🏨 Employer'}
                      </span>
                    </div>
                  </div>
                  {[
                    { to: dashboardLink, label: '🏠 Dashboard' },
                    isSeeker && { to: '/candidate/profile', label: '👤 My Profile' },
                    isSeeker && { to: '/candidate/resume', label: '🤖 AI Resume' },
                    isEmployer && { to: '/employer/post-job', label: '📢 Post a Job' },
                    isEmployer && { to: '/employer/shortlist', label: '🎯 Shortlist & Hire' },
                  ].filter(Boolean).map(item => (
                    <Link
                      key={item.to} to={item.to}
                      onClick={() => setProfileOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: C.text, textDecoration: 'none', fontFamily: FONTS.body, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.target.style.background = C.slate}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >{item.label}</Link>
                  ))}
                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: 13, color: C.redText, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONTS.body }}
                    >🚪 Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged out ── */
            <>
              {!isMobile && <OutlineBtn small onClick={() => navigate('/login')}>Log In</OutlineBtn>}
              <GoldBtn small onClick={() => navigate('/register')}>Sign Up Free</GoldBtn>
            </>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}
            >☰</button>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div style={{
          background: C.navy, borderBottom: `1px solid rgba(255,255,255,0.1)`,
          padding: '8px 16px 16px', zIndex: 99,
        }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.to} to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 0', color: '#CBD5E1', fontSize: 14, textDecoration: 'none', fontFamily: FONTS.body, borderBottom: `1px solid rgba(255,255,255,0.08)` }}
            >{l.label}</Link>
          ))}
          {!currentUser && (
            <div style={{ marginTop: 12 }}>
              <OutlineBtn full onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log In</OutlineBtn>
            </div>
          )}
        </div>
      )}
    </>
  );
}
