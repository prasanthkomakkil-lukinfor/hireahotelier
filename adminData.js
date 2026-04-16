// ─── ADMIN MOCK DATA ─────────────────────────────────────────────────────────
// Full platform-wide data visible only to admins.

export const PLATFORM_STATS = {
  totalUsers:         94_180,
  totalSeekers:       85_400,
  totalEmployers:      8_780,
  activeJobs:         12_440,
  totalApplications:  340_220,
  totalHires:          6_810,
  verifiedHotels:      3_620,
  pendingVerification:    47,
  flaggedContent:         18,
  totalRatings:       28_900,
  monthlyRevenue:     48_200,   // USD
  mrr:                48_200,
  arr:               578_400,
};

export const MONTHLY_SIGNUPS = [
  { month: 'Oct', seekers: 3200, employers: 310 },
  { month: 'Nov', seekers: 3800, employers: 360 },
  { month: 'Dec', seekers: 2900, employers: 280 },
  { month: 'Jan', seekers: 4200, employers: 420 },
  { month: 'Feb', seekers: 5100, employers: 490 },
  { month: 'Mar', seekers: 6400, employers: 610 },
  { month: 'Apr', seekers: 7200, employers: 720 },
];

export const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 18200 },
  { month: 'Nov', revenue: 22400 },
  { month: 'Dec', revenue: 19800 },
  { month: 'Jan', revenue: 31000 },
  { month: 'Feb', revenue: 37500 },
  { month: 'Mar', revenue: 44100 },
  { month: 'Apr', revenue: 48200 },
];

export const JOBS_BY_MARKET = [
  { market: 'UAE 🇦🇪',         count: 3840, pct: 31 },
  { market: 'Saudi Arabia 🇸🇦', count: 2210, pct: 18 },
  { market: 'Qatar 🇶🇦',        count: 1480, pct: 12 },
  { market: 'Singapore 🇸🇬',    count: 1340, pct: 11 },
  { market: 'Malaysia 🇲🇾',     count: 1120, pct: 9  },
  { market: 'Australia 🇦🇺',    count:  980, pct: 8  },
  { market: 'Maldives 🇲🇻',     count:  740, pct: 6  },
  { market: 'Others',           count:  730, pct: 5  },
];

export const SEEKERS_BY_NATIONALITY = [
  { country: 'India 🇮🇳',       count: 32400, pct: 38 },
  { country: 'Philippines 🇵🇭', count: 18900, pct: 22 },
  { country: 'Bangladesh 🇧🇩',  count: 12800, pct: 15 },
  { country: 'Nepal 🇳🇵',       count:  8200, pct: 10 },
  { country: 'Sri Lanka 🇱🇰',   count:  6100, pct:  7 },
  { country: 'Indonesia 🇮🇩',   count:  4200, pct:  5 },
  { country: 'Myanmar 🇲🇲',     count:  2800, pct:  3 },
];

export const ADMIN_USERS = [
  { id: 'u1', name: 'Rajan Mehta',    email: 'rajan@email.com',      role: 'seeker',   nationality: '🇮🇳', status: 'active',    profileStrength: 88, joinedAt: '2024-11-12', lastActive: '2h ago',  videoProfile: true,  linkedIn: true,  applications: 8,  rating: 4.8 },
  { id: 'u2', name: 'Maria Santos',   email: 'maria@email.com',      role: 'seeker',   nationality: '🇵🇭', status: 'active',    profileStrength: 92, joinedAt: '2024-12-03', lastActive: '1d ago',  videoProfile: true,  linkedIn: false, applications: 5,  rating: 4.5 },
  { id: 'u3', name: 'Aditya Kumar',   email: 'aditya@email.com',     role: 'seeker',   nationality: '🇮🇳', status: 'suspended', profileStrength: 55, joinedAt: '2025-01-08', lastActive: '14d ago', videoProfile: false, linkedIn: false, applications: 2,  rating: 3.1 },
  { id: 'u4', name: 'Laleh Rahman',   email: 'laleh@email.com',      role: 'seeker',   nationality: '🇧🇩', status: 'active',    profileStrength: 71, joinedAt: '2025-02-14', lastActive: '3h ago',  videoProfile: false, linkedIn: true,  applications: 12, rating: 0   },
  { id: 'u5', name: 'Taj Hotels HR',  email: 'hr@taj.com',           role: 'employer', nationality: '🇮🇳', status: 'active',    verified: true,  joinedAt: '2024-10-01', lastActive: '1h ago',  activeJobs: 6,  totalHires: 34, plan: 'pro'   },
  { id: 'u6', name: 'Burj Al Arab',   email: 'jobs@burjalarab.ae',   role: 'employer', nationality: '🇦🇪', status: 'active',    verified: true,  joinedAt: '2024-09-15', lastActive: '30m ago', activeJobs: 4,  totalHires: 22, plan: 'pro'   },
  { id: 'u7', name: 'Dubai Scam Co',  email: 'fake@scam.ae',         role: 'employer', nationality: '🇦🇪', status: 'banned',    verified: false, joinedAt: '2025-03-22', lastActive: '7d ago',  activeJobs: 0,  totalHires: 0,  plan: 'free', flags: 8  },
  { id: 'u8', name: 'Shangri-La SG',  email: 'hr@shangri-la.sg',     role: 'employer', nationality: '🇸🇬', status: 'active',    verified: true,  joinedAt: '2024-11-20', lastActive: '2h ago',  activeJobs: 3,  totalHires: 18, plan: 'pro'   },
];

export const PENDING_VERIFICATIONS = [
  { id: 'pv1', hotelName: 'Al Faisaliah Hotel', country: '🇸🇦 Saudi Arabia', city: 'Riyadh',     category: '5-Star', submittedAt: '2025-04-13', docs: ['Trade Licence', 'Hotel Licence', 'HR ID'], hrName: 'Ahmed Al-Rashid', hrEmail: 'hr@alfaisaliah.sa', urgency: 'normal' },
  { id: 'pv2', hotelName: 'Amara Sanctuary',    country: '🇸🇬 Singapore',    city: 'Sentosa',    category: 'Resort',  submittedAt: '2025-04-12', docs: ['Business Reg', 'Hotel Licence'],          hrName: 'Priya Nair',      hrEmail: 'priya@amara.sg',   urgency: 'normal' },
  { id: 'pv3', hotelName: 'Grand Millennium KL', country: '🇲🇾 Malaysia',   city: 'Kuala Lumpur', category: '5-Star', submittedAt: '2025-04-11', docs: ['Trade Licence', 'Hotel Licence', 'HR ID'], hrName: 'Lee Wei Ming',    hrEmail: 'hr@grandmillennium.my', urgency: 'high' },
  { id: 'pv4', hotelName: 'Maldives Pearl',      country: '🇲🇻 Maldives',    city: 'North Malé', category: 'Resort',  submittedAt: '2025-04-10', docs: ['Business Reg'],                           hrName: 'Ibrahim Hassan',  hrEmail: 'ibr@maldivespearl.mv', urgency: 'normal' },
  { id: 'pv5', hotelName: 'Crown Sydney',        country: '🇦🇺 Australia',   city: 'Sydney',     category: '5-Star', submittedAt: '2025-04-09', docs: ['ABN Cert', 'Hotel Licence', 'HR Letter'],  hrName: 'Sarah Williams',  hrEmail: 'hr@crown.au',      urgency: 'low'    },
];

export const FLAGGED_CONTENT = [
  { id: 'f1', type: 'job',     title: 'Hotel Manager – Dubai',     reportedBy: 12, reason: 'Suspected scam – asking for upfront payment',    severity: 'high',   status: 'pending',  createdAt: '2025-04-13', entity: 'Dubai Luxury LLC' },
  { id: 'f2', type: 'rating',  title: 'Review on Taj Hotels',      reportedBy: 2,  reason: 'Fake 1-star review from competitor',             severity: 'medium', status: 'pending',  createdAt: '2025-04-12', entity: 'Anonymous User' },
  { id: 'f3', type: 'profile', title: 'John Smith profile',        reportedBy: 3,  reason: 'Fake certifications claimed',                    severity: 'medium', status: 'pending',  createdAt: '2025-04-11', entity: 'John Smith' },
  { id: 'f4', type: 'job',     title: 'Chef – Riyadh (Multiple)',  reportedBy: 6,  reason: 'Same job reposted by agent account',             severity: 'high',   status: 'reviewing',createdAt: '2025-04-10', entity: 'Saudi Jobs LLC' },
  { id: 'f5', type: 'message', title: 'WhatsApp redirect message', reportedBy: 1,  reason: 'Employer redirecting candidates off-platform',   severity: 'medium', status: 'resolved', createdAt: '2025-04-09', entity: 'Hotel Dubai Inc' },
  { id: 'f6', type: 'rating',  title: 'Review on Seeker Profile',  reportedBy: 1,  reason: 'Defamatory content targeting specific candidate', severity: 'low',   status: 'resolved', createdAt: '2025-04-08', entity: 'Unknown Employer' },
];

export const RECENT_ACTIVITY = [
  { time: '2m ago',  icon: '🏨', text: 'Burj Al Arab posted Executive Chef (Dubai)',         type: 'job'      },
  { time: '8m ago',  icon: '👤', text: 'New seeker registered — Priya Sharma (🇮🇳 India)',   type: 'signup'   },
  { time: '15m ago', icon: '✅', text: 'Hotel verified — Grand Hyatt Riyadh',                type: 'verify'   },
  { time: '22m ago', icon: '🚩', text: 'Job flagged as scam — 3 reports received',           type: 'flag'     },
  { time: '34m ago', icon: '✉️', text: 'Offer letter signed — Rajan Mehta & Taj Dubai',     type: 'offer'    },
  { time: '41m ago', icon: '⭐', text: 'New rating submitted — Shangri-La SG (4.9★)',        type: 'rating'   },
  { time: '1h ago',  icon: '💰', text: 'Boost purchased — Crown Melbourne ($29/7 days)',     type: 'revenue'  },
  { time: '1h ago',  icon: '🤝', text: 'Hire confirmed — Maria Santos → Marina Bay Sands',  type: 'hire'     },
  { time: '2h ago',  icon: '🚫', text: 'Account banned — Dubai Scam Co (8 flags)',           type: 'ban'      },
  { time: '2h ago',  icon: '📢', text: 'F&B Manager job published — Marriott Riyadh',        type: 'job'      },
];

export const BOOST_ORDERS = [
  { id: 'b1', hotel: 'Burj Al Arab',    job: 'Executive Chef',   plan: '14 days', amount: 49, date: '2025-04-12', status: 'active'   },
  { id: 'b2', hotel: 'Crown Melbourne', job: 'Sous Chef',        plan: '7 days',  amount: 29, date: '2025-04-11', status: 'active'   },
  { id: 'b3', hotel: 'Shangri-La SG',   job: 'F&B Manager',     plan: '30 days', amount: 89, date: '2025-04-08', status: 'active'   },
  { id: 'b4', hotel: 'Marriott Riyadh', job: 'Front Desk Mgr',  plan: '7 days',  amount: 29, date: '2025-04-05', status: 'expired'  },
  { id: 'b5', hotel: 'Mandarin KL',     job: 'Spa Therapist',   plan: '14 days', amount: 49, date: '2025-04-01', status: 'expired'  },
];

export const SUPPORT_TICKETS = [
  { id: 't1', from: 'Rajan Mehta',    type: 'seeker',   subject: 'Cannot upload video profile', priority: 'high',   status: 'open',       createdAt: '2025-04-13' },
  { id: 't2', from: 'Taj Hotels HR',  type: 'employer', subject: 'Boost not showing on listing', priority: 'high',   status: 'open',       createdAt: '2025-04-13' },
  { id: 't3', from: 'Maria Santos',   type: 'seeker',   subject: 'Application status stuck',     priority: 'medium', status: 'in_progress',createdAt: '2025-04-12' },
  { id: 't4', from: 'Shangri-La SG',  type: 'employer', subject: 'Billing receipt request',      priority: 'low',    status: 'resolved',   createdAt: '2025-04-10' },
  { id: 't5', from: 'Laleh Rahman',   type: 'seeker',   subject: 'Account recovery needed',      priority: 'medium', status: 'open',       createdAt: '2025-04-09' },
];
