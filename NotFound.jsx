import { useNavigate } from 'react-router-dom';
import { C, FONTS } from '../tokens';
import { GoldBtn, OutlineBtn } from '../components/ui/index';
import TopNav from '../components/layout/TopNav';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏨</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 72, fontWeight: 700, color: C.navy, lineHeight: 1, marginBottom: 8 }}>404</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Page Not Found</div>
        <p style={{ fontSize: 14, color: C.textSoft, fontFamily: FONTS.body, maxWidth: 380, lineHeight: 1.7, marginBottom: 24 }}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back to the right place.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GoldBtn onClick={() => navigate('/')}>Go to Homepage</GoldBtn>
          <OutlineBtn onClick={() => navigate('/jobs')}>Browse Jobs</OutlineBtn>
          <OutlineBtn onClick={() => navigate(-1)}>← Go Back</OutlineBtn>
        </div>
      </div>
    </div>
  );
}
