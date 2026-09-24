import { useTeam } from '../context/TeamContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';

export default function Finished() {
  const { team } = useTeam();

  if (!team) return null;
  if (team.status !== 'finished') return <Navigate to="/home" replace />;

  const finishDate = new Date(team.finishedAt);
  const timeString = finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden text-center">
        <div className="bg-green-500 p-12 text-white">
          <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          <h2 className="text-3xl font-extrabold tracking-tight">Circuit Completed!</h2>
        </div>
        <CardContent className="px-8 py-10 space-y-4">
          <p className="text-gray-500 font-medium">Congratulations, {team.teamName}!</p>
          <p className="text-lg font-bold">You finished at {timeString}</p>
          <p className="text-sm text-gray-400 mt-4">Head back to the organizing desk.</p>
        </CardContent>
      </Card>
    </div>
  );
}
