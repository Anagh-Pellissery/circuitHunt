import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { ref, runTransaction, get, set } from 'firebase/database';

export default function Register() {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState(auth.currentUser?.displayName || '');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [member3, setMember3] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return setError('Not authenticated. Please go back and sign in.');
    setLoading(true);
    
    try {
      const uid = auth.currentUser.uid;
      const email = auth.currentUser.email;

      const countsRef = ref(db, 'meta/circuitAssignmentCounts');
      let assignedCircuit = null;
      
      await runTransaction(countsRef, (counts) => {
        if (!counts) return counts;
        
        const entries = Object.entries(counts);
        let minCount = Infinity;
        for (const [id, count] of entries) {
          if (count < minCount) minCount = count;
        }
        
        const minCircuits = entries.filter(([id, count]) => count === minCount).map(([id]) => id);
        const picked = minCircuits[Math.floor(Math.random() * minCircuits.length)];
        assignedCircuit = picked;
        
        counts[picked]++;
        return counts;
      });
      
      if (!assignedCircuit) throw new Error("Failed to assign circuit.");

      const balanceSnap = await get(ref(db, 'gameConfig/startingBalance'));
      const startingBalance = balanceSnap.exists() ? balanceSnap.val() : 200;

      const teamRef = ref(db, `teams/${uid}`);
      const sessionId = crypto.randomUUID();
      const teamData = {
        teamName,
        leaderName,
        leaderEmail: email,
        members: [member1, member2, member3].filter(Boolean),
        circuitId: assignedCircuit,
        balance: startingBalance,
        status: "playing",
        activeSessionId: sessionId,
        createdAt: Date.now(),
      };
      
      await set(teamRef, teamData);
      
      navigate('/mission');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register Your Team</h1>
      {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          placeholder="Team Name" 
          required 
          value={teamName} 
          onChange={e => setTeamName(e.target.value)} 
        />
        <input 
          placeholder="Leader Name" 
          required 
          value={leaderName} 
          onChange={e => setLeaderName(e.target.value)} 
        />
        <input 
          placeholder="Teammate 2 Name (optional)" 
          value={member1} 
          onChange={e => setMember1(e.target.value)} 
        />
        <input 
          placeholder="Teammate 3 Name (optional)" 
          value={member2} 
          onChange={e => setMember2(e.target.value)} 
        />
        <input 
          placeholder="Teammate 4 Name (optional)" 
          value={member3} 
          onChange={e => setMember3(e.target.value)} 
        />
        <button disabled={loading} type="submit">
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
