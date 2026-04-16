import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { MOCK_JOBS } from '../../data/mockData';
import { AdminShell, ACard, ABadge, ABtn, AInput, ASelect, ASectionTitle, AC } from '../../components/admin/AdminLayout';

const ALL_JOBS = [
  ...MOCK_JOBS,
  { id: 'j7', title: 'Hotel Manager', hotelName: 'Dubai Luxury LLC', country: 'ae', countryLabel: 'UAE', countryFlag: '🇦🇪', city: 'Dubai', department: 'Finance & Admin', type: 'full-time', salary: { min: 5000, max: 8000, currency: 'USD', period: 'month' }, experience: 'exec', hotel_category: '5-Star / Luxury', description: 'Suspicious listing requesting CV fee.', verified: false, urgent: false, postedAt: new Date(Date.now() - 3600000).toISOString(), applicants: 0, views: 12, status: 'flagged', employerId: 'u7' },
  { id: 'j8', title: 'Head Bartender', hotelName: 'Raffles Singapore', country: 'sg', countryLabel: 'Singapore', countryFlag: '🇸🇬', city: 'Singapore', department: 'F&B Service', type: 'full-time', salary: { min: 2800, max: 3600, currency: 'USD', period: 'month' }, experience: 'senior', hotel_category: '5-Star / Luxury', description: 'World-class bartending position.', verified: true, urgent: false, postedAt: new Date(Date.now() - 7200000).toISOString(), applicants: 19, views: 280, status: 'active', employerId: 'emp8' },
];

export default function AdminJobs() {
  const { isMobile } = useBreakpoint();
  const [jobs, setJobs]     = useState(ALL_JOBS);
  const [search, setSearch] = useState('');
  const [statusF, setStatus] = useState('');
  const [marketF, setMarket] = useState('');
  const [toast, setToast]   = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = jobs.filter(j =>
    (!search || j.title.toLowerCase().includes(search.toLowerCase()) || j.hotelName.toLowerCase().includes(search.toLowerCase())) &&
    (!statusF || j.status === statusF) &&
    (!marketF || j.country === marketF)
  );

  const act = (id, action) => {
    const msgs = { feature: '⭐ Job featured on homepage', remove: '🗑 Job removed', approve: '✅ Job approved', flag: '🚩 Job flagged for review' };
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: action === 'remove' ? 'removed' : action === 'flag' ? 'flagged' : j.status, featured: action === 'feature' } : j));
    setToast(msgs[action] || 'Done');
    setTimeout(() => setToast(''), 3000);
  };

  const STATUS_OPTS = [{ value: '', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'flagged', label: 'Flagged' }, { value: 'draft', label: 'Draft' }, { value: 'removed', label: 'Removed' }];
  const MKT_OPTS = [{ value: '', label: 'All Markets' }, { value: 'ae', label: '🇦🇪 UAE' }, { value: 'sa', label: '🇸🇦 Saudi Arabia' }, { value: 'sg', label: '🇸🇬 Singapore' }, { value: 'au', label: '🇦🇺 Australia' }, { value: 'my', label: '🇲🇾 Malaysia' }];

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <ASectionTitle sub={`${jobs.filter(j => j.status === 'active').length} active · ${jobs.filter(j => j.status === 'flagged').length} flagged`}>
          💼 Job Listings
        </ASectionTitle>
        <ABtn color="gold" small>⬇ Export All</ABtn>
      </div>

      {toast && <div style={{ background: AC.greenBg, border: `1px solid ${AC.green}`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: AC.green, fontFamily: FONTS.body }}>{toast}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { v: jobs.filter(j => j.status === 'active').length,  l: 'Active Jobs',   c: AC.green },
          { v: jobs.filter(j => j.status === 'flagged').length, l: 'Flagged',       c: AC.red   },
          { v: jobs.reduce((s, j) => s + (j.applicants || 0), 0), l: 'Applications', c: AC.blue  },
          { v: jobs.reduce((s, j) => s + (j.views || 0), 0),    l: 'Total Views',   c: AC.gold  },
        ].map(s => (
          <ACard key={s.l} style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: s.c }}>{s.v.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{s.l}</div>
          </ACard>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <AInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job title, hotel…" icon="🔍" />
        <ASelect value={statusF} onChange={e => setStatus(e.target.value)} options={STATUS_OPTS} />
        <ASelect value={marketF} onChange={e => setMarket(e.target.value)} options={MKT_OPTS} />
      </div>

      {/* Table */}
      <ACard style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AC.border}`, background: AC.surfaceHov }}>
                {['Job Title', 'Hotel', !isMobile && 'Market', !isMobile && 'Apps', !isMobile && 'Views', 'Status', 'Actions'].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: AC.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr key={job.id} style={{ borderBottom: `1px solid ${AC.border}`, background: job.status === 'flagged' ? 'rgba(239,68,68,0.04)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = AC.surfaceHov}
                  onMouseLeave={e => e.currentTarget.style.background = job.status === 'flagged' ? 'rgba(239,68,68,0.04)' : 'transparent'}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: AC.text }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: AC.muted }}>{job.department}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {job.verified ? <span style={{ fontSize: 10, color: AC.green }}>✓</span> : <span style={{ fontSize: 10, color: AC.red }}>⚠</span>}
                      <span style={{ fontSize: 12, color: AC.textSoft }}>{job.hotelName}</span>
                    </div>
                  </td>
                  {!isMobile && <td style={{ padding: '12px 14px', fontSize: 12, color: AC.textSoft }}>{job.countryFlag} {job.city}</td>}
                  {!isMobile && <td style={{ padding: '12px 14px', fontSize: 12, color: AC.textSoft }}>{job.applicants}</td>}
                  {!isMobile && <td style={{ padding: '12px 14px', fontSize: 12, color: AC.textSoft }}>{job.views}</td>}
                  <td style={{ padding: '12px 14px' }}>
                    <ABadge type={job.status === 'active' ? 'active' : job.status === 'flagged' ? 'high' : job.status === 'removed' ? 'suspended' : 'pending'}>
                      {job.status === 'flagged' ? '🚩 Flagged' : job.status}
                    </ABadge>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {job.status !== 'removed' && <>
                        <ABtn small color="ghost" onClick={() => act(job.id, 'feature')}>⭐</ABtn>
                        {job.status !== 'flagged' && <ABtn small color="ghost" onClick={() => act(job.id, 'flag')}>🚩</ABtn>}
                        <ABtn small color="danger" onClick={() => act(job.id, 'remove')}>🗑</ABtn>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ACard>
    </AdminShell>
  );
}
