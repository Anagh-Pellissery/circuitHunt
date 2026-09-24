import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useMarket } from '../context/MarketContext';
import { auth, db } from '../lib/firebase';
import { ref, get, runTransaction, serverTimestamp } from 'firebase/database';
import { getActiveWindowIndex, getPrice } from '../lib/priceEngine';
import { calculateSwapDelta, checkCircuitCompletion } from '../lib/gameLogic';

export default function Market() {
  const { team } = useTeam();
  const { activeOutpost } = useMarket();
  const navigate = useNavigate();
  
  const [gameConfig, setGameConfig] = useState(null);
  const [components, setComponents] = useState({});
  const [circuit, setCircuit] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);
  const [tab, setTab] = useState('buy'); // 'buy' or 'sell'
  const [loadingAction, setLoadingAction] = useState(false);
  const [countdownStr, setCountdownStr] = useState('');

  useEffect(() => {
    get(ref(db, 'gameConfig')).then(snap => setGameConfig(snap.val()));
    get(ref(db, 'components')).then(snap => setComponents(snap.val() || {}));
  }, []);

  useEffect(() => {
    if (team?.circuitId) {
      get(ref(db, `circuits/${team.circuitId}`)).then(snap => setCircuit(snap.val()));
    }
  }, [team?.circuitId]);

  useEffect(() => {
    if (!gameConfig?.gameStartTimestamp || gameConfig.status !== 'running') return;
    
    const updateWindow = () => {
      const now = Date.now();
      const idx = getActiveWindowIndex(gameConfig.gameStartTimestamp, now);
      setActiveWindow(idx);
      
      const windowDuration = 10 * 60 * 1000;
      const elapsed = now - gameConfig.gameStartTimestamp;
      const nextChange = windowDuration - (elapsed % windowDuration);
      
      const m = Math.floor(nextChange / 60000);
      const s = Math.floor((nextChange % 60000) / 1000);
      setCountdownStr(`${m}m ${s}s`);
    };
    
    updateWindow();
    const interval = setInterval(updateWindow, 1000);
    return () => clearInterval(interval);
  }, [gameConfig]);

  if (!activeOutpost) return <Navigate to="/home" replace />;
  if (!team) return null;
  if (team.status === 'finished') return <Navigate to="/finished" replace />;

  if (gameConfig && gameConfig.status !== 'running') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>The event hasn't started yet.</h2>
        <button onClick={() => navigate('/home')}>Return to Home</button>
      </div>
    );
  }

  const handleSell = async (componentId, boughtPrice) => {
    if (loadingAction) return;
    setLoadingAction(true);
    
    const teamRef = ref(db, `teams/${auth.currentUser.uid}`);
    
    try {
      await runTransaction(teamRef, (currentTeam) => {
        if (!currentTeam) return currentTeam;
        if (!currentTeam.inventory || !currentTeam.inventory[componentId]?.owned) return; 

        currentTeam.inventory[componentId].owned = false;
        currentTeam.balance += boughtPrice;
        
        const logId = Date.now().toString();
        if (!currentTeam.logs) currentTeam.logs = {};
        currentTeam.logs[logId] = {
          type: "sell", outpostId: activeOutpost.slug, componentId, amount: boughtPrice, balanceAfter: currentTeam.balance, timestamp: Date.now()
        };
        
        return currentTeam;
      });
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleBuy = async (componentId, price) => {
    if (loadingAction) return;
    if (team.balance < price) return alert("Insufficient funds!");
    setLoadingAction(true);
    const teamRef = ref(db, `teams/${auth.currentUser.uid}`);
    let finished = false;
    try {
      await runTransaction(teamRef, (currentTeam) => {
        if (!currentTeam) return currentTeam;
        if (currentTeam.balance < price) return; 
        
        currentTeam.balance -= price;
        if (!currentTeam.inventory) currentTeam.inventory = {};
        currentTeam.inventory[componentId] = { owned: true, boughtPrice: price, outpostId: activeOutpost.slug };
        
        const logId = Date.now().toString();
        if (!currentTeam.logs) currentTeam.logs = {};
        currentTeam.logs[logId] = {
          type: "buy", outpostId: activeOutpost.slug, componentId, amount: -price, balanceAfter: currentTeam.balance, timestamp: Date.now()
        };
        
        if (circuit && checkCircuitCompletion(circuit.required, currentTeam.inventory)) {
          currentTeam.status = "finished";
          currentTeam.finishedAt = serverTimestamp();
          finished = true;
        }
        
        return currentTeam;
      });
      if (finished) navigate('/finished');
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSwap = async (componentId, currentPrice, boughtPrice) => {
    if (loadingAction) return;
    if (currentPrice > boughtPrice && team.balance < (currentPrice - boughtPrice)) {
      return alert("Insufficient funds to cover the swap difference!");
    }
    
    setLoadingAction(true);
    const teamRef = ref(db, `teams/${auth.currentUser.uid}`);
    let finished = false;
    
    try {
      await runTransaction(teamRef, (currentTeam) => {
        if (!currentTeam) return currentTeam;
        
        if (currentPrice > boughtPrice && currentTeam.balance < (currentPrice - boughtPrice)) {
          return;
        }
        
        currentTeam.balance += boughtPrice;
        currentTeam.balance -= currentPrice;
        
        if (!currentTeam.inventory) currentTeam.inventory = {};
        currentTeam.inventory[componentId] = { owned: true, boughtPrice: currentPrice, outpostId: activeOutpost.slug };
        
        const logId = Date.now().toString();
        if (!currentTeam.logs) currentTeam.logs = {};
        currentTeam.logs[logId] = {
          type: "swap", oldPrice: boughtPrice, newPrice: currentPrice, amount: currentPrice - boughtPrice, balanceAfter: currentTeam.balance, timestamp: Date.now()
        };
        
        if (circuit && checkCircuitCompletion(circuit.required, currentTeam.inventory)) {
          currentTeam.status = "finished";
          currentTeam.finishedAt = serverTimestamp();
          finished = true;
        }
        
        return currentTeam;
      });
      if (finished) navigate('/finished');
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const inventoryItems = team.inventory ? Object.keys(team.inventory).filter(id => team.inventory[id].owned) : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1>{activeOutpost.name}</h1>
          <button onClick={() => navigate('/home')}>Exit Market</button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ color: 'green' }}>Balance: ₹{team.balance}</h2>
          <p>Prices change in: {countdownStr}</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setTab('buy')} style={{ flex: 1, padding: '1rem', background: tab === 'buy' ? '#ddd' : '#f5f5f5', color: 'black' }}>Buy / Swap</button>
        <button onClick={() => setTab('sell')} style={{ flex: 1, padding: '1rem', background: tab === 'sell' ? '#ddd' : '#f5f5f5', color: 'black' }}>Sell</button>
      </div>

      {tab === 'buy' && (
        <div>
          <h3>Available Components</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.keys(activeOutpost.prices).map(compId => {
              const price = getPrice(activeOutpost, compId, activeWindow);
              if (price === undefined) return null;
              
              const isOwned = team.inventory?.[compId]?.owned;
              const boughtPrice = isOwned ? team.inventory[compId].boughtPrice : 0;
              
              return (
                <li key={compId} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fff', borderBottom: '1px solid #ccc', color: 'black' }}>
                  <div>
                    <strong>{components[compId]?.name || compId}</strong>
                    <br />
                    <span>Current Price: ₹{price}</span>
                  </div>
                  <div>
                    {!isOwned ? (
                      <button disabled={loadingAction} onClick={() => handleBuy(compId, price)}>Buy ₹{price}</button>
                    ) : (
                      <button disabled={loadingAction} onClick={() => handleSwap(compId, price, boughtPrice)}>
                        Swap {calculateSwapDelta(price, boughtPrice).label}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === 'sell' && (
        <div>
          <h3>Your Sellable Components</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {inventoryItems.map(compId => {
              const stocksIt = activeOutpost.prices[compId] !== undefined;
              if (!stocksIt) return null;
              
              const boughtPrice = team.inventory[compId].boughtPrice;
              
              return (
                <li key={compId} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fff', borderBottom: '1px solid #ccc', color: 'black' }}>
                  <div>
                    <strong>{components[compId]?.name || compId}</strong>
                    <br />
                    <span>Bought for: ₹{boughtPrice}</span>
                  </div>
                  <button disabled={loadingAction} onClick={() => handleSell(compId, boughtPrice)}>Sell +₹{boughtPrice}</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
