import { Link, useLocation } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';

const SEEKER_NAV = [
  { to: '/candidate/dashboard',     icon: '🏠', label: 'Overview'          },
  { to: '/candidate/applications',  icon: '📋', label: 'Applications'      },
  { to: '/candidate/offers',        icon: '✉️', label: 'Offer Letters', badge: 1 },
  { to: '/jobs',                    icon: '🔍', label: 'Browse Jobs'        },
  { to: '/candidate/saved',         icon: '❤️', label: 'Saved Jobs'         },
  { to: '/candidate/profile',       icon: '👤', label: 'My Profile'         },
  { to: '/candidate/resume',        icon: '🤖', label: 'AI Resume'          },
  { to: '/candidate/video',         icon: '🎥', label: 'Video Profile'      },
  { to: '/candidate/interview-prep',icon: '🎯', label: 'Interview Prep'     },
  { to: '/candidate/messages',      icon: '📬', label: 'Messages',   badge: 3 },
  { to: '/candidate/ratings',       icon: '⭐', label: 'My Ratings'         },
  { to: '/jobs?type=part-time',     icon: '⚡', label: 'Part-Time Shifts'   },
  { to: '/candidate/settings',      icon: '⚙️', label: 'Settings'           },
];

const EMPLOYER_NAV = [
  { to: '/employer/dashboard',   icon: '🏠', label: 'Overview'                    },
  { to: '/employer/post-job',    icon: '📢', label: 'Post a Job',   special: true  },
  { to: '/employer/jobs',        icon: '💼', label: 'My Jobs'                     },
  { to: '/employer/shortlist',   icon: '🎯', label: 'Shortlist & Hire'            },
  { to: '/employer/interviews',  icon: '📅', label: 'Interviews'                  },
  { to: '/employer/offers',      icon: '✉️', label: 'Offer Letters'               },
  { to: '/employer/shifts',      icon: '⚡', label: 'Post Shift'                  },
  { to: '/employer/messages',    icon: '💬', label: 'Messages',     badge: 3      },
  { to: '/employer/ratings',     icon: '⭐', label: 'Ratings'                     },
  { to: '/employer/analytics',   icon: '📊', label: 'Analytics'                   },
  { to: '/employer/profile',     icon: '🏨', label: 'Hotel Profile'               },
  { to: '/employer/settings',    icon: '⚙️', label: 'Settings'                    },
];

export default function Sidebar({ role = 'seeker', badgeCounts = {}, open = true, onClose }) {
  const { isMobile } = useBreakpoint();
  const location     = useLocation();
  const items        = role === 'seeker' ? SEEKER_NAV : EMPLOYER_NAV;

  const sidebar = (
    <div style={{ width: 200, minHeight: '100%', background: '#FAFBFC', borderRight: `1.5px solid ${C.border}`, display: 'flex', flexDirection: 'column', paddingTop: 8, paddingBottom: 16 }}>
      {items.map(item => {
        const active = location.pathname === item.to.split('?')[0];
        const badge  = item.badge ?? badgeCounts[item.label];
        return (
          <Link key={item.to} to={item.to} onClick={isMobile ? onClose : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', background: active ? C.blueBg : item.special ? `linear-gradient(135deg,${C.gold}22,${C.gold}11)` : 'transparent', borderLeft: active ? `3px solid ${C.gold}` : '3px solid transparent', transition: 'background 0.15s' }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 12.5, flex: 1, color: active ? C.navy : item.special ? C.gold : C.textSoft, fontWeight: active || item.special ? 700 : 400, fontFamily: FONTS.body }}>{item.label}</span>
            {badge && (
              <span style={{ background: C.gold, color: C.navy, borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FONTS.body }}>{badge}</span>
            )}
          </Link>
        );
      })}
    </div>
  );

  if (isMobile) {
    if (!open) return null;
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
        <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 201, boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.textSoft }}>✕</button>
          </div>
          {sidebar}
        </div>
      </>
    );
  }
  return sidebar;
}
