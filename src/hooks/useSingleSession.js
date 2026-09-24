import { useEffect, useRef } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

export function useSingleSession(dbPath, isActive, onKicked) {
  const sessionIdRef = useRef(null);

  useEffect(() => {
    if (!isActive || !dbPath) return;

    const newSessionId = crypto.randomUUID();
    sessionIdRef.current = newSessionId;
    const sessionRef = ref(db, `${dbPath}/activeSessionId`);

    set(sessionRef, newSessionId).catch(err => console.error("Error setting session ID", err));

    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const remoteSessionId = snapshot.val();
      if (remoteSessionId && remoteSessionId !== sessionIdRef.current) {
        if (onKicked) onKicked();
      }
    });

    return () => unsubscribe();
  }, [dbPath, isActive, onKicked]);
}
