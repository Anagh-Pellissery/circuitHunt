import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, get, set, onValue, serverTimestamp, update } from 'firebase/database';

export default function AdminDashboard() {
  const [gameConfig, setGameConfig] = useState({});
  const [teams, setTeams] = useState({});
  const [circuits, setCircuits] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  
  const [startingBalanceInput, setStartingBalanceInput] = useState('');

  useEffect(() => {
    const configRef = ref(db, 'gameConfig');
    const unsubConfig = onValue(configRef, snap => {
      if (snap.exists()) {
        const val = snap.val();
        setGameConfig(val);
        // Only update input if it's currently empty to avoid overwriting while typing, or just strictly bind it.
        // It's safer to only set it initially or if we aren't editing.
        setStartingBalanceInput(prev => prev === '' ? (val.startingBalance?.toString() || '200') : prev);
      }
    });

    const teamsRef = ref(db, 'teams');
    const unsubTeams = onValue(teamsRef, snap => {
      setTeams(snap.exists() ? snap.val() : {});
    });
    
    get(ref(db, 'circuits')).then(snap => setCircuits(snap.exists() ? snap.val() : {}));

    return () => {
      unsubConfig();
      unsubTeams();
    };
  }, []);

  const handleStartClock = () => {
    if (window.confirm("Are you sure you want to start the global clock? This is irreversible.")) {
      update(ref(db, 'gameConfig'), {
        status: 'running',
        gameStartTimestamp: serverTimestamp()
      });
    }
  };

  const handleEndGame = () => {
    if (window.confirm("Are you sure you want to END the game? This stops all transactions.")) {
      update(ref(db, 'gameConfig'), {
        status: 'ended'
      });
    }
  };

  const handleSaveBalance = () => {
    const val = parseInt(startingBalanceInput, 10);
    if (!isNaN(val)) {
      set(ref(db, 'gameConfig/startingBalance'), val);
      alert('Starting balance updated for future registrations.');
    }
  };

  const sortedTeams = Object.entries(teams).map(([uid, team]) => ({ uid, ...team })).sort((a, b) => {
    if (a.status === 'finished' && b.status === 'finished') {
      return a.finishedAt - b.finishedAt;
    }
    if (a.status === 'finished') return -1;
    if (b.status === 'finished') return 1;
    return b.balance - a.balance; // sort playing teams by highest balance
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      <section style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', padding: '1rem', background: '#2c2c2c', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <h3>Game Status: <span style={{ color: gameConfig.status === 'running' ? '#4caf50' : '#ff9800' }}>{gameConfig.status}</span></h3>
          {gameConfig.status === 'not_started' && (
            <button onClick={handleStartClock} style={{ background: '#28a745', color: 'white', padding: '0.8rem 1.5rem', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Start Global Clock</button>
          )}
          {gameConfig.status === 'running' && (
            <button onClick={handleEndGame} style={{ background: '#dc3545', color: 'white', padding: '0.8rem 1.5rem', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>End Game</button>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Starting Balance</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="number" 
              value={startingBalanceInput} 
              onChange={e => setStartingBalanceInput(e.target.value)} 
              style={{ padding: '0.5rem', width: '100px' }}
            />
            <button onClick={handleSaveBalance} style={{ padding: '0.5rem 1rem' }}>Save</button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.5rem' }}>Affects future registrations only.</p>
        </div>
      </section>
      
      <section>
        <h2>Teams Leaderboard</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', color: 'black', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ padding: '1rem' }}>Team Name</th>
                <th style={{ padding: '1rem' }}>Members</th>
                <th style={{ padding: '1rem' }}>Circuit</th>
                <th style={{ padding: '1rem' }}>Progress</th>
                <th style={{ padding: '1rem' }}>Balance</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Finish Time</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map(team => {
                const circ = circuits[team.circuitId];
                const reqCount = circ ? circ.required.length : 0;
                const ownedCount = circ ? circ.required.filter(id => team.inventory?.[id]?.owned).length : 0;
                const logs = team.logs ? Object.values(team.logs).sort((a,b) => b.timestamp - a.timestamp) : [];

                return (
                  <React.Fragment key={team.uid}>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '1rem' }}><strong>{team.teamName}</strong></td>
                      <td style={{ padding: '1rem' }}>{team.leaderName}{team.members?.length > 0 ? `, ${team.members.join(', ')}` : ''}</td>
                      <td style={{ padding: '1rem' }}>{circ ? circ.name : team.circuitId}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: ownedCount === reqCount && reqCount > 0 ? 'green' : 'inherit' }}>{ownedCount} / {reqCount}</td>
                      <td style={{ padding: '1rem' }}>₹{team.balance}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          background: team.status === 'finished' ? '#d4edda' : '#fff3cd',
                          color: team.status === 'finished' ? '#155724' : '#856404'
                        }}>
                          {team.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{team.finishedAt ? new Date(team.finishedAt).toLocaleTimeString() : '-'}</td>
                      <td style={{ padding: '1rem' }}>
                        <button onClick={() => setExpandedTeam(expandedTeam === team.uid ? null : team.uid)} style={{ padding: '0.4rem 0.8rem' }}>
                          {expandedTeam === team.uid ? 'Hide Logs' : 'View Logs'}
                        </button>
                      </td>
                    </tr>
                    {expandedTeam === team.uid && (
                      <tr>
                        <td colSpan="8" style={{ padding: '0', background: '#fafafa' }}>
                          <div style={{ padding: '1rem 2rem' }}>
                            <h4 style={{ marginTop: 0 }}>Transaction Log</h4>
                            {logs.length === 0 ? <p>No transactions yet.</p> : (
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {logs.map(log => (
                                  <li key={log.timestamp} style={{ marginBottom: '0.8rem', borderBottom: '1px dashed #ccc', paddingBottom: '0.8rem' }}>
                                    <span style={{ color: '#666', marginRight: '1rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    <strong style={{ 
                                      display: 'inline-block', 
                                      width: '60px',
                                      color: log.type === 'buy' ? 'blue' : log.type === 'sell' ? 'orange' : 'purple'
                                    }}>
                                      {log.type.toUpperCase()}
                                    </strong> 
                                    {log.componentId} @ {log.outpostId} | 
                                    <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: log.amount > 0 ? 'green' : 'red' }}>
                                      {log.amount > 0 ? '+' : ''}₹{log.amount}
                                    </span>
                                    <span style={{ marginLeft: '1rem', color: '#555' }}>
                                      Balance after: ₹{log.balanceAfter}
                                    </span>
                                    {log.type === 'swap' && (
                                      <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#888' }}>
                                        (Old: ₹{log.oldPrice}, New: ₹{log.newPrice})
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
