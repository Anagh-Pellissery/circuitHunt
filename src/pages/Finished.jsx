import { useTeam } from '../context/TeamContext';

export default function Finished() {
  const { team } = useTeam();

  if (!team) return null;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Circuit Complete! 🎉</h1>
      <h2>Team: {team.teamName}</h2>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Final Balance: ₹{team.balance}</p>
      {team.finishedAt && (
        <p>Finish Time: {new Date(team.finishedAt).toLocaleString()}</p>
      )}
    </div>
  );
}
