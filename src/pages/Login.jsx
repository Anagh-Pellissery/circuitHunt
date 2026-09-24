import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
    if (allowedDomain) {
      provider.setCustomParameters({
        hd: allowedDomain
      });
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
      if (allowedDomain && !user.email.endsWith(`@${allowedDomain}`)) {
        await signOut(auth);
        setError(`Only @${allowedDomain} accounts can play.`);
        setLoading(false);
        return;
      }

      const teamRef = ref(db, `teams/${user.uid}`);
      const teamSnap = await get(teamRef);
      
      if (teamSnap.exists()) {
        navigate('/home');
      } else {
        const gameConfigRef = ref(db, 'gameConfig/status');
        const statusSnap = await get(gameConfigRef);
        if (statusSnap.val() === 'ended') {
          await signOut(auth);
          setError('This event has ended, registration is closed.');
        } else {
          navigate('/register');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Circuit Hunt - Login</h1>
      {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}
      <button disabled={loading} onClick={handleGoogleSignIn}>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
