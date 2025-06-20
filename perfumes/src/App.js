import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import CreatePerfume from './CreatePerfume';
import logo from './logo.png';

function PublicPerfumeList() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/perfumes')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar perfumes');
        return res.json();
      })
      .then(data => {
        setPerfumes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (selected) {
    return (
      <div className="perfume-detail-container">
        <button className="menu-btn" style={{ margin: '1rem 0 1.5rem 0' }} onClick={() => setSelected(null)}>&larr; Volver</button>
        <div className="perfume-detail-card">
          <img className="perfume-detail-img" src={selected.imagen ? `http://localhost:3001/uploads/${selected.imagen}` : 'https://via.placeholder.com/180x180?text=Perfume'} alt={selected.nombre} />
          <div className="perfume-detail-info">
            <h2 style={{ color: 'var(--accent)', marginBottom: 8 }}>{selected.nombre}</h2>
            <div className="perfume-brand">{selected.marca}</div>
            <div className="perfume-desc">{selected.descripcion}</div>
            <div className="perfume-info">{selected.tipo} | {selected.genero} | {selected.tamano}</div>
            <div className="perfume-price">${selected.precio}</div>
            <div className="perfume-stock">Stock: {selected.stock}</div>
            <div style={{ marginTop: 18 }}>
              <a href="https://www.instagram.com/alex.colodrero/" target="_blank" rel="noopener noreferrer" className="menu-btn" style={{ marginRight: 10, width: 160, display: 'inline-block', textAlign: 'center' }}>Instagram Alex</a>
              <a href="https://www.instagram.com/joseosunah/" target="_blank" rel="noopener noreferrer" className="menu-btn" style={{ marginRight: 10, width: 160, display: 'inline-block', textAlign: 'center' }}>Instagram Jose</a>
              <a href="https://wa.me/645131103" target="_blank" rel="noopener noreferrer" className="menu-btn" style={{ width: 160, display: 'inline-block', textAlign: 'center' }}>WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero-title">
        <span>Perfumes disponibles</span>
      </div>
      {loading && <p>Cargando perfumes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="perfume-list">
        {perfumes.map(perfume => (
          <div className="perfume-card clickable" key={perfume.id} onClick={() => setSelected(perfume)}>
            <img
              className="perfume-img"
              src={perfume.imagen ? `http://localhost:3001/uploads/${perfume.imagen}` : 'https://via.placeholder.com/120x120?text=Perfume'}
              alt={perfume.nombre}
            />
            <div className="perfume-title">{perfume.nombre}</div>
            <div className="perfume-brand">{perfume.marca}</div>
            <div className="perfume-desc">{perfume.descripcion}</div>
            <div className="perfume-info">
              {perfume.tipo} | {perfume.genero} | {perfume.tamano}
            </div>
            <div className="perfume-price">${perfume.precio}</div>
            <div className="perfume-stock">Stock: {perfume.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contacto() {
  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(44,44,44,0.04)', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--accent)' }}>Contacto</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>¿Quieres saber más o hacer un pedido?</p>
      <div style={{ marginBottom: 12 }}>
<b>Instagram:</b> <a href="https://www.instagram.com/alex.colodrero/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@alex.colodrero</a>
      </div>
      <div style={{ marginBottom: 12 }}>
    <b>Instagram:</b> <a href="https://www.instagram.com/joseosunah/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@joseosunah</a>
      </div>
      <div style={{ marginBottom: 12 }}>
        <b>Email:</b> <a href="mailto:contacto@perfumesarabesae.com" style={{ color: 'var(--accent)' }}>contacto@perfumesarabesae.com</a>
      </div>
      <div>
<b>WhatsApp:</b> <a href="https://wa.me/645131103" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>+34 645 13 11 03</a>
      </div>
    </div>
  );
}

function EditPerfumeModal({ perfume, onClose, onUpdated }) {
  const [form, setForm] = useState({ ...perfume });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/perfumes/${perfume.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error actualizando perfume');
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>Editar perfume</h3>
        <form onSubmit={handleSubmit}>
          <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" />
          <input name="marca" value={form.marca} onChange={handleChange} required placeholder="Marca" />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required placeholder="Precio" />
          <input name="tamano" value={form.tamano} onChange={handleChange} placeholder="Tamaño" />
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option>Eau de Parfum</option>
            <option>Eau de Toilette</option>
            <option>Parfum</option>
            <option>Eau Fraiche</option>
            <option>Cologne</option>
          </select>
          <select name="genero" value={form.genero} onChange={handleChange}>
            <option>Unisex</option>
            <option>Femenino</option>
            <option>Masculino</option>
          </select>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" className="menu-btn" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" className="logout-btn" onClick={onClose}>Cancelar</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

function EditPerfumePanel({ perfumes, onUpdated }) {
  const [editPerfume, setEditPerfume] = useState(null);

  return (
    <div style={{ margin: '2rem auto', maxWidth: 700 }}>
      <h3 style={{ color: 'var(--accent)' }}>Editar perfumes</h3>
      <div className="perfume-list">
        {perfumes.map(perfume => (
          <div className="perfume-card clickable" key={perfume.id}>
            <img className="perfume-img" src={perfume.imagen ? `http://localhost:3001/uploads/${perfume.imagen}` : 'https://via.placeholder.com/120x120?text=Perfume'} alt={perfume.nombre} />
            <div className="perfume-title">{perfume.nombre}</div>
            <div className="perfume-brand">{perfume.marca}</div>
            <div className="perfume-desc">{perfume.descripcion}</div>
            <div className="perfume-info">{perfume.tipo} | {perfume.genero} | {perfume.tamano}</div>
            <div className="perfume-price">${perfume.precio}</div>
            <div className="perfume-stock">Stock: {perfume.stock}</div>
            <button className="menu-btn" onClick={() => setEditPerfume(perfume)}>Editar</button>
          </div>
        ))}
      </div>
      {editPerfume && <EditPerfumeModal perfume={editPerfume} onClose={() => setEditPerfume(null)} onUpdated={onUpdated} />}
    </div>
  );
}

function DeletePerfumePanel({ perfumes, onDeleted }) {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este perfume?')) return;
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/perfumes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error eliminando perfume');
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ margin: '2rem auto', maxWidth: 700 }}>
      <h3 style={{ color: 'var(--accent)' }}>Eliminar perfumes</h3>
      <div className="perfume-list">
        {perfumes.map(perfume => (
          <div className="perfume-card" key={perfume.id}>
            <img className="perfume-img" src={perfume.imagen ? `http://localhost:3001/uploads/${perfume.imagen}` : 'https://via.placeholder.com/120x120?text=Perfume'} alt={perfume.nombre} />
            <div className="perfume-title">{perfume.nombre}</div>
            <div className="perfume-brand">{perfume.marca}</div>
            <div className="perfume-desc">{perfume.descripcion}</div>
            <div className="perfume-info">{perfume.tipo} | {perfume.genero} | {perfume.tamano}</div>
            <div className="perfume-price">${perfume.precio}</div>
            <div className="perfume-stock">Stock: {perfume.stock}</div>
            <button className="menu-btn" onClick={() => handleDelete(perfume.id)} disabled={loadingId === perfume.id}>Eliminar</button>
            {loadingId === perfume.id && <span style={{ color: 'var(--accent)', marginLeft: 8 }}>Eliminando...</span>}
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

function AdminPanel({ onLogout }) {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [panel, setPanel] = useState(null); // null, 'crear', 'editar', 'eliminar', 'public'

  const fetchPerfumes = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/admin/perfumes', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('adminToken')
      }
    })
      .then(res => res.json())
      .then(data => {
        setPerfumes(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (panel) fetchPerfumes();
  }, [panel]);

  return (
    <div className="App">
      <h2 className="admin-panel-title">Panel de administración</h2>
      <div className="admin-section">
        <div className="admin-section-title">Productos</div>
        <div className="admin-btn-row">
          <div className="admin-btn-item"><span className="admin-btn-num"></span><button className="menu-btn" onClick={() => setPanel('crear')}>Agregar producto</button></div>
      <div className="admin-btn-item"><span className="admin-btn-num"></span><button className="menu-btn" onClick={() => setPanel('eliminar')}>Eliminar producto</button></div>
      <div className="admin-btn-item"><span className="admin-btn-num"></span><button className="menu-btn" onClick={() => setPanel('editar')}>Modificar producto</button></div>
  <div className="admin-btn-item"><span className="admin-btn-num"></span><button className="menu-btn" onClick={() => setPanel(panel === 'public' ? null : 'public')}>{panel === 'public' ? 'Ocultar todos' : 'Mostrar todos'}</button></div>
        </div>
      </div>
      
      {panel === 'crear' && <CreatePerfume onCreated={fetchPerfumes} />}
      {panel === 'editar' && <EditPerfumePanel perfumes={perfumes} onUpdated={fetchPerfumes} />}
      {panel === 'eliminar' && <DeletePerfumePanel perfumes={perfumes} onDeleted={fetchPerfumes} />}
      {panel === 'public' && <PublicPerfumeList />}
      {loading && panel && <p>Cargando perfumes...</p>}
      {error && panel && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

function LoginInfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>Acceso solo para administradores</h3>
        <p style={{ marginBottom: 18 }}>Este apartado es exclusivo para el administrador del sitio. No tiene funcionalidad para clientes ni usuarios normales.</p>
        <button className="menu-btn" onClick={onClose} style={{ margin: '0 auto', display: 'block' }}>Entendido</button>
      </div>
    </div>
  );
}

function App() {
  const [admin, setAdmin] = useState(!!localStorage.getItem('adminToken'));
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginInfo, setShowLoginInfo] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'contacto'

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(false);
    setShowLogin(false);
  };

  return (
    <div>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="logo" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', marginRight: 10 }} />
          <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setView('home')}>Perfumes Arabes AE</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="menu-btn" style={{ background: view === 'home' ? 'var(--accent)' : 'var(--detail)', color: view === 'home' ? '#fff' : 'var(--text)' }} onClick={() => setView('home')}>Home</button>
          {!admin && (
            <button className="menu-btn" style={{ background: view === 'contacto' ? 'var(--accent)' : 'var(--detail)', color: view === 'contacto' ? '#fff' : 'var(--text)' }} onClick={() => setView('contacto')}>Contacto</button>
          )}
          {!admin && (
            <button className="menu-btn" onClick={() => setShowLoginInfo(true)} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, marginLeft: 10 }} title="Admin Login">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
            </button>
          )}
          {admin && (
            <button className="menu-btn" onClick={handleLogout} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, marginLeft: 10 }} title="Cerrar sesión">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          )}
        </div>
      </nav>
      {showLoginInfo && <LoginInfoModal onClose={() => { setShowLoginInfo(false); setShowLogin(true); }} />}
      {showLogin && !admin && <Login onLogin={() => { setAdmin(true); setShowLogin(false); }} />}
      {!admin && !showLogin && view === 'home' && <PublicPerfumeList />}
      {!admin && !showLogin && view === 'contacto' && <Contacto />}
      {admin && <AdminPanel onLogout={handleLogout} />}
    </div>
  );
}

export default App;
