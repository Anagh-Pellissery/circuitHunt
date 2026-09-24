import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    
    if (passcode === correctPasscode) {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid passcode');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-xl rounded-[2.5rem]">
        <CardHeader className="text-center pt-10 pb-6">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Admin Portal</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                placeholder="Enter Passcode" 
                value={passcode} 
                onChange={e => setPasscode(e.target.value)} 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            <Button type="submit" className="w-full h-14 text-lg">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
