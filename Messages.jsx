import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit, doc, updateDoc } from '../../firebase';
import { C, FONTS } from '../../tokens';
import { Card, Input, GoldBtn, OutlineBtn, SecLabel, Badge, Spinner, EmptyState } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

// Mock conversations for UI development
const MOCK_CONVOS = [
  {
    id: 'c1',
    otherParty: { name: 'Burj Al Arab HR', avatar: '🏨', role: 'employer' },
    lastMessage: 'Thank you for applying. We would like to schedule an interview.',
    lastMessageAt: new Date(Date.now() - 30 * 60000).toISOString(),
    unread: 2,
    jobTitle: 'Executive Chef',
  },
  {
    id: 'c2',
    otherParty: { name: 'Marina Bay Sands', avatar: '🏨', role: 'employer' },
    lastMessage: 'Your video profile was impressive. Are you available for a call?',
    lastMessageAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    unread: 1,
    jobTitle: 'F&B Manager',
  },
  {
    id: 'c3',
    otherParty: { name: 'Crown Melbourne', avatar: '🏨', role: 'employer' },
    lastMessage: 'We have reviewed your application and moved it to the shortlist.',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    unread: 0,
    jobTitle: 'Sous Chef',
  },
];

const MOCK_MESSAGES = {
  c1: [
    { id: 'm1', senderId: 'emp1', text: 'Hello! Thank you for applying for the Executive Chef position.', sentAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'm2', senderId: 'me', text: 'Thank you for reaching out. I am very excited about this opportunity.', sentAt: new Date(Date.now() - 90 * 60000).toISOString() },
    { id: 'm3', senderId: 'emp1', text: 'Your video profile was excellent. We would like to schedule an interview at your earliest convenience.', sentAt: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: 'm4', senderId: 'emp1', text: 'Are you available this Thursday or Friday for a video call?', sentAt: new Date(Date.now() - 28 * 60000).toISOString() },
  ],
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso);
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Messages() {
  const { currentUser, userProfile } = useAuth();
  const { isMobile } = useBreakpoint();
  const [activeConvo, setActiveConvo] = useState(MOCK_CONVOS[0]);
  const [messages, setMessages]       = useState(MOCK_MESSAGES['c1'] || []);
  const [newMessage, setNewMessage]   = useState('');
  const [sending, setSending]         = useState(false);
  const [showList, setShowList]       = useState(!isMobile);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load mock messages for active conversation
    setMessages(MOCK_MESSAGES[activeConvo?.id] || []);
    if (isMobile) setShowList(false);
  }, [activeConvo?.id, isMobile]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const msg = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      sentAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setSending(false);
    // In production: addDoc(collection(db, 'conversations', activeConvo.id, 'messages'), { ...msg, sentAt: serverTimestamp() })
  };

  const ConversationList = () => (
    <div style={{ width: isMobile ? '100%' : 280, borderRight: `1.5px solid ${C.border}`, background: '#FAFBFC', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 10px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>Messages</div>
        <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginTop: 2 }}>{MOCK_CONVOS.filter(c => c.unread > 0).length} unread</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {MOCK_CONVOS.map(convo => (
          <div
            key={convo.id}
            onClick={() => setActiveConvo(convo)}
            style={{
              padding: '12px 16px', cursor: 'pointer', transition: 'background 0.1s',
              background: activeConvo?.id === convo.id ? C.blueBg : 'transparent',
              borderLeft: activeConvo?.id === convo.id ? `3px solid ${C.gold}` : '3px solid transparent',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {convo.otherParty.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{convo.otherParty.name}</span>
                  <span style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body, flexShrink: 0, marginLeft: 6 }}>{timeAgo(convo.lastMessageAt)}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                  {convo.lastMessage}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body }}>Re: {convo.jobTitle}</span>
                  {convo.unread > 0 && (
                    <span style={{ background: C.gold, color: C.navy, borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.body }}>{convo.unread}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatWindow = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Chat header */}
      <div style={{ padding: '12px 18px', borderBottom: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, background: 'white' }}>
        {isMobile && (
          <button onClick={() => setShowList(true)} style={{ background: 'none', border: 'none', color: C.navy, fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        )}
        <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          {activeConvo.otherParty.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy }}>{activeConvo.otherParty.name}</div>
          <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>Re: {activeConvo.jobTitle} · <span style={{ color: C.greenText }}>● Online</span></div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <OutlineBtn small>📅 Schedule</OutlineBtn>
          <OutlineBtn small>👤 Profile</OutlineBtn>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', background: C.slate, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '72%' }}>
                <div style={{
                  background: isMe ? C.navy : 'white',
                  color: isMe ? 'white' : C.text,
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '10px 14px', fontSize: 13,
                  fontFamily: FONTS.body, lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 3, textAlign: isMe ? 'right' : 'left', fontFamily: FONTS.body }}>
                  {timeAgo(msg.sentAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '12px 16px', borderTop: `1.5px solid ${C.border}`, background: 'white', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Type a message… (Enter to send)"
          rows={2}
          style={{
            flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 10,
            padding: '8px 12px', fontSize: 13, fontFamily: FONTS.body,
            resize: 'none', outline: 'none', minWidth: 0,
          }}
        />
        <GoldBtn onClick={sendMessage} disabled={sending || !newMessage.trim()}>
          {sending ? <Spinner size={16} color={C.navy} /> : '📤 Send'}
        </GoldBtn>
      </div>
    </div>
  );

  return (
    <DashboardShell role={userProfile?.role || 'seeker'}>
      <div style={{ height: 'calc(100vh - 120px)', display: 'flex', background: 'white', borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {(!isMobile || showList) && <ConversationList />}
        {(!isMobile || !showList) && activeConvo && <ChatWindow />}
        {!isMobile && !activeConvo && (
          <EmptyState icon="💬" title="Select a conversation" message="Choose from the list on the left to start messaging." />
        )}
      </div>
    </DashboardShell>
  );
}
