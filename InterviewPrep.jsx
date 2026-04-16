import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useAIInterviewPrep } from '../../hooks/useAI';
import { C, FONTS, DEPARTMENTS, EXPERIENCE_LEVELS } from '../../tokens';
import { Card, GoldBtn, OutlineBtn, Select, SecLabel, Badge, Spinner, Note } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const TYPE_COLOR = {
  technical:    { bg: C.blueBg,    text: C.blueText,  label: '🔧 Technical'    },
  behavioral:   { bg: C.greenBg,   text: C.greenText, label: '💬 Behavioural'  },
  situational:  { bg: C.amberBg,   text: '#92400E',   label: '🎯 Situational'  },
};

export default function InterviewPrep() {
  const { userProfile } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();
  const { questions, loading, generate } = useAIInterviewPrep();

  const [role, setRole]       = useState(userProfile?.headline?.split('|')[0]?.trim() || '');
  const [dept, setDept]       = useState(userProfile?.department || '');
  const [answered, setAnswered] = useState({});
  const [answers, setAnswers]   = useState({});
  const [filter, setFilter]     = useState('');

  const handleGenerate = () => {
    if (!role && !dept) return;
    generate(role, dept);
  };

  const filtered = filter ? questions.filter(q => q.type === filter) : questions;

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          🎯 Interview Preparation
        </div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 24 }}>
          AI-generated interview questions tailored to your role. Practice your answers before the big day.
        </div>

        {/* Generator card */}
        <Card style={{ marginBottom: 20 }}>
          <SecLabel>Generate Questions For</SecLabel>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Target Role</label>
              <input
                value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Executive Chef, F&B Manager"
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = C.gold}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <Select
              label="Department"
              id="dept"
              value={dept}
              onChange={e => setDept(e.target.value)}
              options={DEPARTMENTS}
              placeholder="Select department"
            />
            <GoldBtn onClick={handleGenerate} disabled={loading || (!role && !dept)}>
              {loading
                ? <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Spinner size={16} color={C.navy} />Generating…</span>
                : '🤖 Generate Questions'}
            </GoldBtn>
          </div>
          <Note type="blue">Questions are tailored to luxury 5-star hospitality standards. Answer them out loud to practice — or use them to brief yourself the night before your interview.</Note>
        </Card>

        {questions.length > 0 && (
          <>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['', 'All Questions', questions.length], ['technical', '🔧 Technical', questions.filter(q => q.type === 'technical').length], ['behavioral', '💬 Behavioural', questions.filter(q => q.type === 'behavioral').length], ['situational', '🎯 Situational', questions.filter(q => q.type === 'situational').length]].map(([val, label, count]) => (
                <button key={val} onClick={() => setFilter(val)} style={{
                  background: filter === val ? C.navy : 'white', color: filter === val ? C.gold : C.textSoft,
                  border: `1.5px solid ${filter === val ? C.navy : C.border}`, borderRadius: 20,
                  padding: '5px 14px', fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body,
                  fontWeight: filter === val ? 700 : 400,
                }}>{label} ({count})</button>
              ))}
            </div>

            {/* Question cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((q, i) => {
                const meta = TYPE_COLOR[q.type] || TYPE_COLOR.behavioral;
                const isOpen = answered[i];
                return (
                  <Card key={i} style={{ borderLeft: `3px solid ${meta.text}` }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, background: meta.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: meta.text, fontFamily: FONTS.body, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                          <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: C.navy, flex: 1 }}>{q.q}</div>
                          <Badge type={q.type === 'technical' ? 'navy' : q.type === 'behavioral' ? 'green' : 'gold'}>{meta.label}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Interviewer's tip */}
                    {q.tip && (
                      <div style={{ background: C.slate, borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>
                        <span style={{ fontWeight: 700, color: C.navy }}>💡 What they're looking for: </span>{q.tip}
                      </div>
                    )}

                    {/* Practice answer area */}
                    <div>
                      {!isOpen ? (
                        <OutlineBtn small onClick={() => setAnswered(prev => ({ ...prev, [i]: true }))}>
                          ✍️ Practice My Answer
                        </OutlineBtn>
                      ) : (
                        <div>
                          <textarea
                            value={answers[i] || ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                            placeholder="Type your answer here to practice. This is private — only you can see it."
                            rows={4}
                            style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: FONTS.body, resize: 'vertical', outline: 'none', marginBottom: 8 }}
                            onFocus={e => e.target.style.borderColor = C.gold}
                            onBlur={e => e.target.style.borderColor = C.border}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <GoldBtn small onClick={() => setAnswered(prev => ({ ...prev, [i]: false }))}>✓ Done</GoldBtn>
                            <OutlineBtn small onClick={() => setAnswers(prev => ({ ...prev, [i]: '' }))}>Clear</OutlineBtn>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Note type="green" style={{ marginTop: 16 }}>
              Tip: Record yourself answering these questions on your phone. Watch it back — you'll immediately spot what to improve. Most people are surprised by their own filler words and pace.
            </Note>
          </>
        )}

        {!loading && questions.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎯</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, color: C.navy, marginBottom: 8 }}>Ready to Prepare?</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, maxWidth: 380, margin: '0 auto' }}>
              Enter your target role and department above. Our AI will generate 8 questions specifically for luxury hospitality interviews.
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
