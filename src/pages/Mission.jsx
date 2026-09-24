import { useEffect, useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function Mission() {
  const { team } = useTeam();
  const location = useLocation();
  const navigate = useNavigate();
  const [circuit, setCircuit] = useState(null);
  const [componentNames, setComponentNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (team?.circuitId) {
        const snap = await get(ref(db, `circuits/${team.circuitId}`));
        if (snap.exists()) setCircuit(snap.val());
        const compSnap = await get(ref(db, 'components'));
        if (compSnap.exists()) setComponentNames(compSnap.val());
      }
    };
    fetchData();
  }, [team?.circuitId]);

  if (!location.state?.justRegistered) {
    return <Navigate to="/home" replace />;
  }

  if (!circuit) return <div className="min-h-screen bg-muted flex items-center justify-center font-medium">Loading Mission...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-black p-10 text-center text-white">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">Your Mission</h2>
          <CardTitle className="text-4xl font-extrabold">{circuit.name}</CardTitle>
        </div>
        <CardContent className="px-8 py-8 space-y-6 text-center">
          <p className="text-gray-600 font-medium">You must collect the following components to complete your circuit:</p>
          <ul className="space-y-3">
            {circuit.required.map(id => (
              <li key={id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-lg">
                {componentNames[id]?.name || id}
              </li>
            ))}
          </ul>
          <Button 
            onClick={() => navigate('/home')} 
            className="w-full h-14 text-lg mt-4"
          >
            Let's go!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
