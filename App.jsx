import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// ── Public ───────────────────────────────────────────────────────────────────
import Landing            from './pages/Landing';
import ForEmployers       from './pages/ForEmployers';
import About              from './pages/About';
import { TermsOfService, PrivacyPolicy, Contact } from './pages/Legal';
import Login              from './pages/auth/Login';
import Register           from './pages/auth/Register';
import ForgotPassword     from './pages/auth/ForgotPassword';
import LinkedInCallback   from './pages/auth/LinkedInCallback';
import AdminLogin         from './pages/auth/AdminLogin';
import JobSearch          from './pages/jobs/JobSearch';
import JobDetail          from './pages/jobs/JobDetail';
import NotFound           from './pages/NotFound';

// ── Candidate ────────────────────────────────────────────────────────────────
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile   from './pages/candidate/Profile';
import AIResume           from './pages/candidate/AIResume';
import VideoProfile       from './pages/candidate/VideoProfile';
import Applications       from './pages/candidate/Applications';
import CandidateOffers    from './pages/candidate/Offers';
import InterviewPrep      from './pages/candidate/InterviewPrep';
import SavedJobs          from './pages/jobs/SavedJobs';

// ── Employer ─────────────────────────────────────────────────────────────────
import EmployerDashboard  from './pages/employer/Dashboard';
import EmployerJobs       from './pages/employer/Jobs';
import PostJob            from './pages/employer/PostJob';
import Shortlist          from './pages/employer/Shortlist';
import OfferLetter        from './pages/employer/OfferLetter';
import EmployerAnalytics  from './pages/employer/Analytics';
import HotelProfile       from './pages/employer/HotelProfile';
import Interviews         from './pages/employer/Interviews';
import EmployerShifts     from './pages/employer/Shifts';

// ── Shared ───────────────────────────────────────────────────────────────────
import Ratings            from './pages/Ratings';
import Messages           from './pages/Messages';
import Settings           from './pages/Settings';

// ── Admin ────────────────────────────────────────────────────────────────────
import { AdminRoute }     from './components/admin/AdminLayout';
import AdminDashboard     from './pages/admin/Dashboard';
import AdminUsers         from './pages/admin/Users';
import AdminVerifications from './pages/admin/Verifications';
import AdminFlags         from './pages/admin/Flags';
import AdminJobs          from './pages/admin/Jobs';
import AdminAnalytics     from './pages/admin/Analytics';
import AdminRevenue       from './pages/admin/Revenue';
import AdminRatings       from './pages/admin/Ratings';
import { AdminSupport, AdminAnnouncements, AdminSettings } from './pages/admin/Support';

const P = ({ role, children }) => <ProtectedRoute requiredRole={role}>{children}</ProtectedRoute>;
const A = ({ children })       => <AdminRoute>{children}</AdminRoute>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"                         element={<Landing />} />
          <Route path="/for-employers"            element={<ForEmployers />} />
          <Route path="/about"                    element={<About />} />
          <Route path="/terms"                    element={<TermsOfService />} />
          <Route path="/privacy"                  element={<PrivacyPolicy />} />
          <Route path="/contact"                  element={<Contact />} />
          <Route path="/login"                    element={<Login />} />
          <Route path="/register"                 element={<Register />} />
          <Route path="/forgot-password"          element={<ForgotPassword />} />
          <Route path="/auth/linkedin/callback"   element={<LinkedInCallback />} />
          <Route path="/admin/login"              element={<AdminLogin />} />
          <Route path="/jobs"                     element={<JobSearch />} />
          <Route path="/jobs/:id"                 element={<JobDetail />} />
          <Route path="/candidate/profile/:id"    element={<CandidateProfile readOnly />} />

          {/* Candidate */}
          <Route path="/candidate/dashboard"      element={<P role="seeker"><CandidateDashboard /></P>} />
          <Route path="/candidate/profile"        element={<P role="seeker"><CandidateProfile /></P>} />
          <Route path="/candidate/resume"         element={<P role="seeker"><AIResume /></P>} />
          <Route path="/candidate/video"          element={<P role="seeker"><VideoProfile /></P>} />
          <Route path="/candidate/applications"   element={<P role="seeker"><Applications /></P>} />
          <Route path="/candidate/offers"         element={<P role="seeker"><CandidateOffers /></P>} />
          <Route path="/candidate/saved"          element={<P role="seeker"><SavedJobs /></P>} />
          <Route path="/candidate/ratings"        element={<P role="seeker"><Ratings /></P>} />
          <Route path="/candidate/messages"       element={<P role="seeker"><Messages /></P>} />
          <Route path="/candidate/settings"       element={<P role="seeker"><Settings /></P>} />
          <Route path="/candidate/interview-prep" element={<P role="seeker"><InterviewPrep /></P>} />

          {/* Employer */}
          <Route path="/employer/dashboard"       element={<P role="employer"><EmployerDashboard /></P>} />
          <Route path="/employer/jobs"            element={<P role="employer"><EmployerJobs /></P>} />
          <Route path="/employer/post-job"        element={<P role="employer"><PostJob /></P>} />
          <Route path="/employer/shortlist"       element={<P role="employer"><Shortlist /></P>} />
          <Route path="/employer/shortlist/:jobId" element={<P role="employer"><Shortlist /></P>} />
          <Route path="/employer/offer/:id"       element={<P role="employer"><OfferLetter /></P>} />
          <Route path="/employer/interviews"      element={<P role="employer"><Interviews /></P>} />
          <Route path="/employer/shifts"          element={<P role="employer"><EmployerShifts /></P>} />
          <Route path="/employer/ratings"         element={<P role="employer"><Ratings /></P>} />
          <Route path="/employer/analytics"       element={<P role="employer"><EmployerAnalytics /></P>} />
          <Route path="/employer/profile"         element={<P role="employer"><HotelProfile /></P>} />
          <Route path="/employer/messages"        element={<P role="employer"><Messages /></P>} />
          <Route path="/employer/settings"        element={<P role="employer"><Settings /></P>} />

          {/* Admin */}
          <Route path="/admin"                    element={<A><AdminDashboard /></A>} />
          <Route path="/admin/analytics"          element={<A><AdminAnalytics /></A>} />
          <Route path="/admin/revenue"            element={<A><AdminRevenue /></A>} />
          <Route path="/admin/jobs"               element={<A><AdminJobs /></A>} />
          <Route path="/admin/users"              element={<A><AdminUsers /></A>} />
          <Route path="/admin/verifications"      element={<A><AdminVerifications /></A>} />
          <Route path="/admin/ratings"            element={<A><AdminRatings /></A>} />
          <Route path="/admin/flags"              element={<A><AdminFlags /></A>} />
          <Route path="/admin/support"            element={<A><AdminSupport /></A>} />
          <Route path="/admin/announcements"      element={<A><AdminAnnouncements /></A>} />
          <Route path="/admin/settings"           element={<A><AdminSettings /></A>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
