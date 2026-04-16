import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { ADMIN_USERS } from '../../data/adminData';
import { AdminShell, ACard, ABadge, ABtn, AInput, ASelect, ASectionTitle, AC } from '../../components/admin/AdminLayout';

const ROLE_OPTS   = [{ value: '', label: 'All Roles' }, { value: 'seeker', label: 'Seekers' }, { value: 'employer', label: 'Employers' }];
const STATUS_OPTS = [{ value: '', label: 'All Statuses' }, { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }, { value: 'banned', label: 'Banned' }];

function UserRow({ user, isMobile, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const isEmployer = user.role === 'employer';

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        style={{ borderBottom: `1px solid ${AC.border}`, cursor: 'pointer', transition: 'background 0.1s' }}
        onMouseEnter={e => e.currentTarget.style.background = AC.surfaceHov}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <td style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: isEmployer ? `rgba(201,160,82,0.15)` : `rgba(59,130,246,0.15)`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {isEmployer ? '🏨' : user.nationality}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{user.name}</div>
              <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{user.email}</div>
            </div>
          </div>
        </td>
        {!isMobile && <td style={{ padding: '12px 14px' }}><ABadge type={user.role === 'employer' ? 'pro' : 'default'}>{isEmployer ? '🏨 Employer' : '👤 Seeker'}</ABadge></td>}
        <td style={{ padding: '12px 14px' }}><ABadge type={user.status}>{user.status}</ABadge></td>
        {!isMobile && (
          <td style={{ padding: '12px 14px', fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>
            {isEmployer ? `${user.activeJobs} jobs · ${user.totalHires} hires` : `${user.applications} apps · ★${user.rating || '—'}`}
          </td>
        )}
        {!isMobile && <td style={{ padding: '12px 14px', fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{user.lastActive}</td>}
        {!isMobile && (
          <td style={{ padding: '12px 14px' }}>
            {isEmployer && <ABadge type={user.plan || 'free'}>{user.plan === 'pro' ? '⭐ Pro' : '🆓 Free'}</ABadge>}
            {isEmployer && user.verified && <span style={{ marginLeft: 6 }}><ABadge type="verified">✓ Verified</ABadge></span>}
          </td>
        )}
        <td style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {user.status === 'active' && (
              <>
                <ABtn small color="ghost" onClick={e => { e.stopPropagation(); onAction('suspend', user); }}>Suspend</ABtn>
                <ABtn small color="danger" onClick={e => { e.stopPropagation(); onAction('ban', user); }}>Ban</ABtn>
              </>
            )}
            {user.status === 'suspended' && <ABtn small color="green" onClick={e => { e.stopPropagation(); onAction('reinstate', user); }}>Reinstate</ABtn>}
            {user.status === 'banned' && <ABtn small color="ghost" onClick={e => { e.stopPropagation(); onAction('reinstate', user); }}>Unban</ABtn>}
          </div>
        </td>
      </tr>
      {/* Expanded row */}
      {expanded && (
        <tr style={{ background: AC.surfaceHov }}>
          <td colSpan={7} style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body }}>
              <div><span style={{ color: AC.muted }}>Joined: </span><span style={{ color: AC.text }}>{user.joinedAt}</span></div>
              {user.profileStrength && <div><span style={{ color: AC.muted }}>Profile: </span><span style={{ color: AC.text }}>{user.profileStrength}%</span></div>}
              {user.videoProfile !== undefined && <div><span style={{ color: AC.muted }}>Video: </span><span style={{ color: user.videoProfile ? AC.green : AC.muted }}>{user.videoProfile ? '✓ Yes' : '✗ No'}</span></div>}
              {user.linkedIn !== undefined && <div><span style={{ color: AC.muted }}>LinkedIn: </span><span style={{ color: user.linkedIn ? AC.green : AC.muted }}>{user.linkedIn ? '✓ Linked' : '✗ No'}</span></div>}
              {user.flags && <div><span style={{ color: AC.muted }}>Flags: </span><span style={{ color: AC.red, fontWeight: 700 }}>{user.flags} reports</span></div>}
              <ABtn small color="ghost" onClick={() => window.open(`/candidate/profile/${user.id}`, '_blank')}>👤 View Public Profile</ABtn>
              <ABtn small color="ghost">📧 Send Email</ABtn>
              <ABtn small color="ghost">📋 Activity Log</ABtn>
              {user.role === 'employer' && !user.verified && <ABtn small color="green">✅ Verify Hotel</ABtn>}
              {user.role === 'seeker' && <ABtn small color="ghost">⬆ Promote to Admin</ABtn>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminUsers() {
  const { isMobile } = useBreakpoint();
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState('');
  const [statusFilter, setStatus] = useState('');
  const [users, setUsers]       = useState(ADMIN_USERS);
  const [toast, setToast]       = useState('');

  const filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!statusFilter || u.status === statusFilter)
  );

  const handleAction = (action, user) => {
    const newStatus = action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    const messages = { suspend: `${user.name} suspended`, ban: `${user.name} permanently banned`, reinstate: `${user.name} reinstated` };
    setToast(messages[action]);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <AdminShell>
      <ASectionTitle sub={`${users.length} total users · ${users.filter(u => u.status === 'active').length} active`}>
        👥 User Management
      </ASectionTitle>

      {toast && (
        <div style={{ background: AC.greenBg, border: `1px solid ${AC.green}`, borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: AC.green, fontFamily: FONTS.body }}>
          ✓ {toast}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { v: '85,400', l: 'Job Seekers',  c: AC.blue },
          { v: '8,780',  l: 'Employers',    c: AC.gold },
          { v: '3',      l: 'Suspended',    c: AC.amber },
          { v: '1',      l: 'Banned',       c: AC.red },
        ].map(s => (
          <ACard key={s.l} style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{s.l}</div>
          </ACard>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <AInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" icon="🔍" />
        <ASelect value={roleFilter} onChange={e => setRole(e.target.value)} options={ROLE_OPTS} placeholder="All Roles" />
        <ASelect value={statusFilter} onChange={e => setStatus(e.target.value)} options={STATUS_OPTS} placeholder="All Statuses" />
        <ABtn small color="ghost" onClick={() => { setSearch(''); setRole(''); setStatus(''); }}>Clear</ABtn>
        <ABtn small color="gold">⬇ Export CSV</ABtn>
      </div>

      {/* Table */}
      <ACard style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AC.border}`, background: AC.surfaceHov }}>
                {['User', !isMobile && 'Role', 'Status', !isMobile && 'Activity', !isMobile && 'Last Seen', !isMobile && 'Plan', 'Actions'].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: AC.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: AC.muted, fontFamily: FONTS.body }}>No users found</td></tr>
              ) : (
                filtered.map(u => <UserRow key={u.id} user={u} isMobile={isMobile} onAction={handleAction} />)
              )}
            </tbody>
          </table>
        </div>
      </ACard>
    </AdminShell>
  );
}
