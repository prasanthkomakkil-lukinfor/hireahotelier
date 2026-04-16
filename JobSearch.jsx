import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useBreakpoint, useDebounce, useGeolocation, useCountdown } from '../../hooks/useBreakpoint';
import { C, FONTS, SHADOWS, JOB_MARKETS, DEPARTMENTS, EXPERIENCE_LEVELS, HOTEL_CATEGORIES } from '../../tokens';
import { MOCK_JOBS, MOCK_SHIFTS } from '../../data/mockData';
import { Card, Badge, Chip, GoldBtn, OutlineBtn, Input, Select, Checkbox, SecLabel, StatCard, EmptyState, Spinner } from '../../components/ui/index';
import TopNav from '../../components/layout/TopNav';
import { useAuth } from '../../context/AuthContext';
import { db, collection, query, where, orderBy, getDocs, applyToJob } from '../../firebase';

// ─── SHIFT CARD (with countdown) ─────────────────────────────────────────────
function ShiftCard({ shift }) {
  const countdown = useCountdown(shift.shiftDate);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);

  const apply = async () => {
    if (!currentUser) { navigate('/login'); return; }
    await applyToJob(shift.id, currentUser.uid, 'Part-time shift application');
    setApplied(true);
  };

  return (
    <Card style={{ borderLeft: `4px solid ${shift.urgent ? '#EF4444' : C.gold}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy }}>{shift.role}</span>
            {shift.urgent && <Badge type="red">⚡ Urgent</Badge>}
          </div>
          <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{shift.hotel} · {shift.city} · {shift.time}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <Chip>💰 ${shift.pay}/{shift.payPeriod}</Chip>
            {countdown && <Chip>⏱ Starts in {countdown}</Chip>}
          </div>
        </div>
        <GoldBtn small onClick={apply} disabled={applied}>
          {applied ? '✓ Applied' : '1-Tap Apply'}
        </GoldBtn>
      </div>
    </Card>
  );
}

// ─── JOB CARD ────────────────────────────────────────────────────────────────
function JobCard({ job }) {
  const navigate = useNavigate();
  const isShift = job.type === 'part-time' && job.shiftDate;

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso);
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const salaryStr = job.salary?.amount
    ? `$${job.salary.amount}/${job.salary.period}`
    : job.salary
    ? `$${job.salary.min?.toLocaleString()}–$${job.salary.max?.toLocaleString()}/${job.salary.period}`
    : '';

  return (
    <Card hover onClick={() => navigate(`/jobs/${job.id}`)} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Hotel logo */}
        <div style={{
          width: 46, height: 46, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`,
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>🏨</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 3 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{job.title}</span>
            {job.verified  && <Badge type="green">✓ Verified</Badge>}
            {job.urgent    && <Badge type="red">🔥 Urgent</Badge>}
            {isShift       && <Badge type="purple">⚡ Shift</Badge>}
          </div>
          <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 6, fontFamily: FONTS.body }}>
            {job.hotelName} · {job.countryFlag} {job.city}, {job.countryLabel}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Chip>{job.type === 'part-time' ? '⚡ Part-Time' : '💼 Full-Time'}</Chip>
            {salaryStr && <Chip>💰 {salaryStr}</Chip>}
            {job.visaSponsorship && <Chip>✈️ Visa Sponsored</Chip>}
            {job.accommodationProvided && <Chip>🏠 Accommodation</Chip>}
            <Chip>📂 {job.department}</Chip>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <GoldBtn small onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>Apply Now</GoldBtn>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body }}>{timeAgo(job.postedAt)}</span>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body }}>{job.applicants} applicants</span>
        </div>
      </div>
    </Card>
  );
}

// ─── FILTER PANEL ────────────────────────────────────────────────────────────
function FilterPanel({ filters, setFilters, onClose, isMobile }) {
  const F = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setFilters(f => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v],
  }));

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontFamily: FONTS.body }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>Filters</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.textSoft }}>✕</button>
        </div>
      )}

      <Section title="Job Type">
        {[['full-time','💼 Full-Time'],['part-time','⚡ Part-Time Shifts'],['contract','📋 Contract']].map(([v,l]) => (
          <Checkbox key={v} id={`type-${v}`} label={l} checked={filters.types.includes(v)} onChange={() => toggle('types', v)} />
        ))}
      </Section>

      <Section title="Job Market / Country">
        {JOB_MARKETS.map(m => (
          <Checkbox key={m.code} id={`mkt-${m.code}`} label={`${m.flag} ${m.label}`} checked={filters.markets.includes(m.code)} onChange={() => toggle('markets', m.code)} />
        ))}
      </Section>

      <Section title="Department">
        {DEPARTMENTS.slice(0, 6).map(d => (
          <Checkbox key={d} id={`dept-${d}`} label={d} checked={filters.departments.includes(d)} onChange={() => toggle('departments', d)} />
        ))}
      </Section>

      <Section title="Experience Level">
        {EXPERIENCE_LEVELS.map(l => (
          <Checkbox key={l.value} id={`exp-${l.value}`} label={l.label} checked={filters.experience.includes(l.value)} onChange={() => toggle('experience', l.value)} />
        ))}
      </Section>

      <Section title="Hotel Category">
        {HOTEL_CATEGORIES.slice(0, 4).map(c => (
          <Checkbox key={c} id={`cat-${c}`} label={c} checked={filters.hotelCats.includes(c)} onChange={() => toggle('hotelCats', c)} />
        ))}
      </Section>

      <Section title="Special Filters">
        <Checkbox id="visa" label="✈️ Visa Sponsored Only" checked={filters.visaOnly} onChange={e => F('visaOnly', e.target.checked)} />
        <Checkbox id="accom" label="🏠 Accommodation Provided" checked={filters.accomOnly} onChange={e => F('accomOnly', e.target.checked)} />
        <Checkbox id="verified" label="✓ Verified Hotels Only" checked={filters.verifiedOnly} onChange={e => F('verifiedOnly', e.target.checked)} />
      </Section>

      <GoldBtn full onClick={onClose}>Apply Filters</GoldBtn>
      <button
        onClick={() => setFilters({ types: [], markets: [], departments: [], experience: [], hotelCats: [], visaOnly: false, accomOnly: false, verifiedOnly: false })}
        style={{ background: 'none', border: 'none', color: C.textSoft, cursor: 'pointer', fontSize: 12, width: '100%', marginTop: 8, padding: 6, fontFamily: FONTS.body }}
      >Clear all filters</button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function JobSearch() {
  const { isMobile, isTablet } = useBreakpoint();
  const [searchParams] = useSearchParams();
  const { getLocation, location: geoLoc } = useGeolocation();

  const [search, setSearch]         = useState(searchParams.get('q') || '');
  const [country, setCountry]       = useState(searchParams.get('country') || '');
  const [jobType, setJobType]       = useState(searchParams.get('type') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode]     = useState('list');  // 'list' | 'shift'
  const [loading, setLoading]       = useState(false);

  const [filters, setFilters] = useState({
    types: jobType ? [jobType] : [], markets: country ? [country] : [],
    departments: [], experience: [], hotelCats: [],
    visaOnly: false, accomOnly: false, verifiedOnly: false,
  });

  const debouncedSearch = useDebounce(search);

  // Apply filters to mock data
  const filteredJobs = useMemo(() => {
    let jobs = MOCK_JOBS;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.hotelName.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
      );
    }
    if (filters.types.length)       jobs = jobs.filter(j => filters.types.includes(j.type));
    if (filters.markets.length)     jobs = jobs.filter(j => filters.markets.includes(j.country));
    if (filters.departments.length) jobs = jobs.filter(j => filters.departments.includes(j.department));
    if (filters.experience.length)  jobs = jobs.filter(j => filters.experience.includes(j.experience));
    if (filters.visaOnly)           jobs = jobs.filter(j => j.visaSponsorship);
    if (filters.accomOnly)          jobs = jobs.filter(j => j.accommodationProvided);
    if (filters.verifiedOnly)       jobs = jobs.filter(j => j.verified);
    return jobs;
  }, [debouncedSearch, filters]);

  const showShifts = viewMode === 'shift' || jobType === 'part-time';

  return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />

      {/* ── Search header ── */}
      <div style={{ background: C.navy, padding: isMobile ? '14px 16px' : '16px 32px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : 200 }}>
            <Input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Job title, hotel, skill…" icon="🔍"
            />
          </div>
          <div style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 'calc(50% - 5px)' : 170 }}>
            <Select
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="📍 Any Country"
              options={JOB_MARKETS.map(m => ({ value: m.code, label: `${m.flag} ${m.label}` }))}
            />
          </div>
          <div style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 'calc(50% - 5px)' : 150 }}>
            <Select
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              placeholder="⏱ Any Type"
              options={[{ value: 'full-time', label: '💼 Full-Time' }, { value: 'part-time', label: '⚡ Part-Time' }]}
            />
          </div>
          <GoldBtn onClick={() => {}}>Search</GoldBtn>
          {isMobile && (
            <OutlineBtn onClick={() => setShowFilters(true)} style={{ background: 'white' }}>
              ⚙️ Filters {Object.values(filters).flat().filter(Boolean).length > 0 && `(${Object.values(filters).flat().filter(Boolean).length})`}
            </OutlineBtn>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
        {/* ── Sidebar filters (desktop always visible) ── */}
        {!isMobile && (
          <div style={{ width: 240, borderRight: `1.5px solid ${C.border}`, background: '#FAFBFC', flexShrink: 0, overflowY: 'auto' }}>
            <FilterPanel filters={filters} setFilters={setFilters} isMobile={false} />
          </div>
        )}

        {/* ── Mobile filter overlay ── */}
        {isMobile && showFilters && (
          <>
            <div onClick={() => setShowFilters(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
            <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: 320, background: C.white, zIndex: 201, overflowY: 'auto', boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}>
              <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} isMobile />
            </div>
          </>
        )}

        {/* ── Results ── */}
        <div style={{ flex: 1, padding: isMobile ? '14px 12px' : '20px 24px', minWidth: 0 }}>
          {/* View toggle + count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: 14, color: C.text, fontFamily: FONTS.body }}>
                Showing <strong>{filteredJobs.length}</strong> jobs
                {country && ` in ${JOB_MARKETS.find(m => m.code === country)?.label}`}
              </span>
              {geoLoc && <span style={{ fontSize: 12, color: C.gold, marginLeft: 8, fontFamily: FONTS.body }}>📍 Near you</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={getLocation}
                style={{ background: C.blueBg, border: `1px solid ${C.blueBorder}`, color: C.blueText, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body }}
              >📍 Jobs Near Me</button>
              {['list','shift'].map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{ background: viewMode === m ? C.navy : C.white, color: viewMode === m ? C.gold : C.textSoft, border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body }}>
                  {m === 'list' ? '📋 Jobs' : '⚡ Shifts'}
                </button>
              ))}
            </div>
          </div>

          {/* Shifts view */}
          {showShifts && (
            <div style={{ marginBottom: 24 }}>
              <SecLabel>Part-Time Shifts Available Today</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isTablet || isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {MOCK_SHIFTS.map(s => <ShiftCard key={s.id} shift={s} />)}
              </div>
              {!showFilters && <div style={{ borderBottom: `2px solid ${C.border}`, marginBottom: 20, paddingBottom: 4 }} />}
            </div>
          )}

          {/* Job cards */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner size={36} /></div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState icon="🔍" title="No jobs found" message="Try adjusting your filters or search term." action={<OutlineBtn onClick={() => setFilters({ types:[], markets:[], departments:[], experience:[], hotelCats:[], visaOnly:false, accomOnly:false, verifiedOnly:false })}>Clear Filters</OutlineBtn>} />
          ) : (
            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}
