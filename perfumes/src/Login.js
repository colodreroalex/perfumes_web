import React, { useState } from 'react';
import './App.css';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de login');
      localStorage.setItem('adminToken', data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h2 style={{ color: 'var(--accent)', marginTop: '2rem' }}>Login Administrador</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,44,44,0.04)' }}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid var(--detail)' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid var(--detail)' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login; 