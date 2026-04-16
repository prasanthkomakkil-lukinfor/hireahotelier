// ─── PUSH NOTIFICATIONS HOOK ──────────────────────────────────────────────────
// Uses Firebase Cloud Messaging (FCM) for push notifications.
// Notifications sent from Cloud Functions on application status changes.

import { useState, useEffect, useCallback } from 'react';
import { db, doc, updateDoc } from '../firebase';

/**
 * Requests notification permission and gets FCM token.
 * Stores token in Firestore on the user's profile.
 */
export function useNotifications(uid) {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const requestPermission = useCallback(async () => {
    if (!uid) return;
    if (!('Notification' in window)) {
      setError('Push notifications are not supported in this browser.');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // In production: import { getMessaging, getToken } from 'firebase/messaging'
        // and get the actual FCM token. We mock it here.
        const mockToken = `fcm_${uid}_${Date.now()}`;
        setToken(mockToken);

        // Store token in Firestore for Cloud Functions to use
        await updateDoc(doc(db, 'users', uid), {
          fcmTokens: mockToken,   // In production, use arrayUnion(actualToken)
          notificationsEnabled: true,
        });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  return { permission, token, loading, error, requestPermission };
}

/**
 * Local in-app notification queue (for toasts/banners).
 * Separate from FCM push — these show while the user is on the site.
 */
export function useInAppNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'view',    message: '👁 Burj Al Arab viewed your profile',        time: '2m ago',  read: false },
    { id: 'n2', type: 'match',   message: '🎯 New job match: F&B Manager at Marriott',   time: '1h ago',  read: false },
    { id: 'n3', type: 'status',  message: '📋 Shangri-La moved you to "Shortlisted"',    time: '3h ago',  read: true  },
    { id: 'n4', type: 'shift',   message: '⚡ New shift near you: Banquet tonight $28/hr',time: '4h ago', read: false },
    { id: 'n5', type: 'message', message: '💬 New message from Taj Hotels HR',           time: '1d ago',  read: true  },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const add = useCallback((notification) => {
    const id = `n${Date.now()}`;
    setNotifications(prev => [{ id, read: false, time: 'Just now', ...notification }, ...prev]);
    return id;
  }, []);

  return { notifications, unreadCount, markRead, markAllRead, dismiss, add };
}

/**
 * Toast notification system — shows ephemeral banners.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => show(msg, 'success', dur), [show]);
  const error   = useCallback((msg, dur) => show(msg, 'error',   dur), [show]);
  const info    = useCallback((msg, dur) => show(msg, 'info',    dur), [show]);

  return { toasts, show, dismiss, success, error, info };
}
