import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="password" 
          placeholder="Enter Passcode" 
          value={passcode} 
          onChange={e => setPasscode(e.target.value)} 
          required 
          style={{ padding: '0.5rem', fontSize: '1.2rem' }}
        />
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.8rem', fontSize: '1.2rem', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}
