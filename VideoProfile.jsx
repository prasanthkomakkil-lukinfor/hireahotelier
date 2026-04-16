import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { C, FONTS } from '../../tokens';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebase';
import { Card, GoldBtn, OutlineBtn, NavyBtn, SecLabel, Badge, Note, Alert, Spinner } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const PROMPTS = [
  { time: '0–20s', icon: '👋', text: 'Introduce yourself — your name, current role, and years of experience.' },
  { time: '20–50s', icon: '🏆', text: 'Share your biggest career achievement or proudest moment in hospitality.' },
  { time: '50–75s', icon: '🎯', text: 'Why are you looking for a new role and what\'s your ideal next position?' },
];

export default function VideoProfile() {
  const { userProfile, updateProfile } = useAuth();
  const [recording, setRecording]     = useState(false);
  const [recorded, setRecorded]       = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [uploaded, setUploaded]       = useState(!!userProfile?.videoProfileURL);
  const [elapsed, setElapsed]         = useState(0);
  const [error, setError]             = useState('');
  const [promptIdx, setPromptIdx]     = useState(0);

  const videoRef    = useRef();
  const previewRef  = useRef();
  const mediaRef    = useRef(null);
  const chunksRef   = useRef([]);
  const timerRef    = useRef(null);
  const blobRef     = useRef(null);

  const MAX_SECONDS = 90;

  // Auto-advance prompt based on elapsed time
  useEffect(() => {
    if (elapsed < 20)      setPromptIdx(0);
    else if (elapsed < 50) setPromptIdx(1);
    else                   setPromptIdx(2);
  }, [elapsed]);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blobRef.current);
        previewRef.current.src = url;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
        setRecorded(true);
      };
      mr.start(100);
      mediaRef.current = mr;
      setRecording(true);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= MAX_SECONDS - 1) { stopRecording(); return e; }
          return e + 1;
        });
      }, 1000);
    } catch (e) {
      setError('Camera access denied. Please allow camera and microphone access in your browser settings.');
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRef.current?.state === 'recording') mediaRef.current.stop();
    setRecording(false);
  };

  const uploadVideo = async () => {
    if (!blobRef.current) return;
    setUploading(true);
    setError('');
    try {
      const storageRef = ref(storage, `videos/${useAuth().currentUser.uid}/profile.webm`);
      await uploadBytes(storageRef, blobRef.current);
      const url = await getDownloadURL(storageRef);
      await updateProfile({ videoProfileURL: url });
      setUploaded(true);
    } catch (e) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const retake = () => { setRecorded(false); setElapsed(0); blobRef.current = null; };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 4 }}>🎥 Video Profile</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 24 }}>
          Record a 90-second intro. Candidates with video profiles get 3× more views from employers.
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
        {uploaded && !recording && !recorded && (
          <div style={{ background: C.greenBg, border: `1.5px solid ${C.greenBorder}`, borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.greenText, fontFamily: FONTS.body }}>✅ Video Profile is Live!</div>
              <div style={{ fontSize: 12, color: C.greenText, fontFamily: FONTS.body, marginTop: 2 }}>Employers can view your intro. You can re-record at any time.</div>
            </div>
            <a href={userProfile?.videoProfileURL} target="_blank" rel="noopener noreferrer">
              <OutlineBtn small>▶ Preview</OutlineBtn>
            </a>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
          {/* ── Camera area ── */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
              {/* Live camera feed */}
              <video ref={videoRef} muted autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: recording ? 'block' : 'none' }} />
              {/* Playback preview */}
              <video ref={previewRef} controls style={{ width: '100%', height: '100%', objectFit: 'cover', display: recorded ? 'block' : 'none' }} />
              {/* Idle state */}
              {!recording && !recorded && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎥</div>
                  <div style={{ color: '#94A3B8', fontSize: 14, fontFamily: FONTS.body }}>Camera preview will appear here</div>
                  <div style={{ color: '#64748B', fontSize: 12, fontFamily: FONTS.body, marginTop: 6 }}>Click "Start Recording" below</div>
                </div>
              )}
              {/* Recording indicator */}
              {recording && (
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: '4px 12px' }}>
                  <div style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                  <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
                  <span style={{ color: 'white', fontSize: 12, fontFamily: FONTS.body, fontWeight: 700 }}>REC {fmtTime(elapsed)}</span>
                  <span style={{ color: '#94A3B8', fontSize: 11, fontFamily: FONTS.body }}>/ {fmtTime(MAX_SECONDS)}</span>
                </div>
              )}
              {/* Time progress bar */}
              {recording && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.2)' }}>
                  <div style={{ background: elapsed > 75 ? '#EF4444' : C.gold, width: `${(elapsed / MAX_SECONDS) * 100}%`, height: '100%', transition: 'width 1s linear' }} />
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ padding: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!recording && !recorded && (
                <GoldBtn onClick={startRecording}>🔴 Start Recording</GoldBtn>
              )}
              {recording && (
                <NavyBtn onClick={stopRecording}>⏹ Stop Recording</NavyBtn>
              )}
              {recorded && !uploading && (
                <>
                  <GoldBtn onClick={uploadVideo}>☁️ Upload & Save</GoldBtn>
                  <OutlineBtn onClick={retake}>🔄 Re-record</OutlineBtn>
                </>
              )}
              {uploading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Spinner size={20} />
                  <span style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Uploading your video…</span>
                </div>
              )}
            </div>
          </Card>

          {/* ── Prompts + tips ── */}
          <div>
            <Card style={{ marginBottom: 14 }}>
              <SecLabel>Script Prompts</SecLabel>
              <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 12 }}>Follow these 3 prompts for the best result:</div>
              {PROMPTS.map((p, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                  background: recording && promptIdx === i ? C.cream : C.slate,
                  border: recording && promptIdx === i ? `1.5px solid ${C.gold}` : `1.5px solid ${C.border}`,
                  transition: 'all 0.3s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, fontFamily: FONTS.body }}>{p.time}</span>
                    {recording && promptIdx === i && <Badge type="gold">Now speaking</Badge>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                    <span style={{ fontSize: 12, color: C.text, fontFamily: FONTS.body, lineHeight: 1.5 }}>{p.text}</span>
                  </div>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <SecLabel>Quick Tips</SecLabel>
              {[
                ['💡', 'Good lighting — face a window or lamp'],
                ['🔇', 'Quiet background, no background music'],
                ['👔', 'Dress professionally (hotel uniform is great)'],
                ['📱', 'Hold phone horizontally OR use laptop camera'],
                ['😊', 'Smile and speak naturally — be yourself!'],
              ].map(([ic, t], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 6 }}>
                  <span style={{ flexShrink: 0 }}>{ic}</span><span>{t}</span>
                </div>
              ))}
            </Card>

            <Note type="green">
              Employers say a video profile makes them 3× more likely to reach out. It takes just 2 minutes and sets you apart from hundreds of text-only applications.
            </Note>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
