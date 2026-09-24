import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useMarket } from '../context/MarketContext';
import { db } from '../lib/firebase';
import { ref, get, onValue } from 'firebase/database';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Home() {
  const { team } = useTeam();
  const { setActiveOutpost } = useMarket();
  const navigate = useNavigate();
  const [circuit, setCircuit] = useState(null);
  const [components, setComponents] = useState({});
  const [gameStatus, setGameStatus] = useState('not_started');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const statusRef = ref(db, 'gameConfig/status');
    const unsubStatus = onValue(statusRef, snap => {
      setGameStatus(snap.val());
    });

    if (team?.circuitId) {
      get(ref(db, `circuits/${team.circuitId}`)).then(snap => setCircuit(snap.val()));
    }
    
    get(ref(db, 'components')).then(snap => setComponents(snap.val() || {}));

    return () => unsubStatus();
  }, [team?.circuitId]);

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
    
    scanner.render(async (decodedText) => {
      scanner.clear();
      setScanning(false);
      
      const outpostsRef = ref(db, 'outposts');
      const snap = await get(outpostsRef);
      if (snap.exists()) {
        const outposts = snap.val();
        const found = Object.values(outposts).find(o => o.slug === decodedText);
        if (found) {
          setActiveOutpost(found);
          navigate('/market');
        } else {
          alert('Invalid QR code scanned.');
        }
      }
    }, (error) => {
      // ignore frame errors
    });

    return () => {
      scanner.clear().catch(e => console.log(e));
    };
  }, [scanning, navigate, setActiveOutpost]);

  if (!team) return null;
  if (team.status === 'finished') return <Navigate to="/finished" replace />;

  const ownedItems = team.inventory ? Object.keys(team.inventory).filter(id => team.inventory[id].owned) : [];
  const requiredCount = circuit ? circuit.required.length : 0;
  const ownedRequiredCount = circuit ? circuit.required.filter(id => ownedItems.includes(id)).length : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{team.teamName}</h1>
        <h2 style={{ color: 'green' }}>₹{team.balance}</h2>
      </header>
      
      <section style={{ margin: '2rem 0', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ color: 'black' }}>Your Circuit: {circuit?.name || 'Loading...'}</h3>
        <p style={{ color: 'black', fontWeight: 'bold' }}>Progress: {ownedRequiredCount} / {requiredCount} collected</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {circuit?.required.map(compId => {
            const isOwned = ownedItems.includes(compId);
            return (
              <li key={compId} style={{ color: isOwned ? 'green' : 'grey', fontWeight: isOwned ? 'bold' : 'normal' }}>
                {isOwned ? '✅ ' : '❌ '}{components[compId]?.name || compId}
              </li>
            );
          })}
        </ul>
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h3>Inventory</h3>
        {ownedItems.length === 0 ? <p>Your inventory is empty.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {ownedItems.map(id => (
              <li key={id}>
                {components[id]?.name || id} (Bought for ₹{team.inventory[id].boughtPrice})
              </li>
            ))}
          </ul>
        )}
      </section>

      {gameStatus !== 'running' ? (
        <div style={{ padding: '1rem', background: 'gold', textAlign: 'center', fontWeight: 'bold' , color: 'black' }}>
          The marketplace opens once the event clock starts.
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {!scanning ? (
            <button onClick={() => setScanning(true)} style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}>
              Scan QR to enter a marketplace
            </button>
          ) : (
            <div>
              <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', background: 'white' }}></div>
              <button onClick={() => setScanning(false)} style={{ marginTop: '1rem' }}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
