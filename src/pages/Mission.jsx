import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';

export default function Mission() {
  const { team } = useTeam();
  const navigate = useNavigate();
  const location = useLocation();
  const [circuit, setCircuit] = useState(null);
  const [componentNames, setComponentNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (team?.circuitId) {
        const snap = await get(ref(db, `circuits/${team.circuitId}`));
        if (snap.exists()) {
          setCircuit(snap.val());
        }
        const compSnap = await get(ref(db, 'components'));
        if (compSnap.exists()) {
          setComponentNames(compSnap.val());
        }
      }
    };
    fetchData();
  }, [team?.circuitId]);

  // If not just registered, redirect to home
  if (!location.state?.justRegistered) {
    return <Navigate to="/home" replace />;
  }

  if (!team) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Your Mission: {circuit ? circuit.name : 'Loading...'}</h1>
      <p>To win, you must collect the following components:</p>
      
      {circuit && (
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.2rem', marginBottom: '2rem' }}>
          {circuit.required.map(compId => (
            <li key={compId} style={{ padding: '0.5rem', background: '#e0e0e0', margin: '0.5rem 0', borderRadius: '4px', color: 'black' }}>
              {componentNames[compId]?.name || compId}
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={() => navigate('/home', { replace: true })} style={{ fontSize: '1.2rem', padding: '0.5rem 2rem' }}>
        Let's go!
      </button>
    </div>
  );
}
