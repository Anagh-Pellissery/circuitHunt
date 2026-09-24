import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, auth } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useSingleSession } from '../hooks/useSingleSession';
import { signOut } from 'firebase/auth';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const teamPath = currentUser ? `teams/${currentUser.uid}` : null;
  
  const onKicked = useCallback(() => {
    alert('Session opened elsewhere.');
    signOut(auth);
    window.location.href = '/login';
  }, []);

  // Single session hook tracks session for this specific team if they are logged in and have a team object
  useSingleSession(teamPath, !!(currentUser && team), onKicked);

  useEffect(() => {
    if (!currentUser) {
      setTeam(null);
      setLoading(false);
      return;
    }

    const teamRef = ref(db, `teams/${currentUser.uid}`);
    const unsubscribe = onValue(teamRef, (snapshot) => {
      setTeam(snapshot.exists() ? snapshot.val() : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <TeamContext.Provider value={{ team, loading }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
