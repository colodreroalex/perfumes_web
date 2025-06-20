import React, { useState } from 'react';

function CreatePerfume({ onCreated }) {
  const [form, setForm] = useState({
    nombre: '', marca: '', descripcion: '', precio: '', tipo: 'Eau de Parfum', genero: 'Unisex', tamano: '100ml', stock: '', imagen: null
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setForm(f => ({ ...f, imagen: files[0] }));
      setImgPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let imagenFilename = '';
    try {
      // Subir imagen si hay
      if (form.imagen) {
        const fd = new FormData();
        fd.append('imagen', form.imagen);
        const res = await fetch('http://localhost:3001/api/admin/perfumes/upload', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') },
          body: fd
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error subiendo imagen');
        imagenFilename = data.filename;
      }
      // Crear perfume
      const res2 = await fetch('http://localhost:3001/api/admin/perfumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ ...form, imagen: imagenFilename })
      });
      const data2 = await res2.json();
      if (!res2.ok) throw new Error(data2.error || 'Error creando perfume');
      onCreated();
      setForm({ nombre: '', marca: '', descripcion: '', precio: '', tipo: 'Eau de Parfum', genero: 'Unisex', tamano: '100ml', stock: '', imagen: null });
      setImgPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,44,44,0.04)' }}>
      <h3 style={{ color: 'var(--accent)' }}>Nuevo perfume</h3>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <select name="tipo" value={form.tipo} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }}>
        <option>Eau de Parfum</option>
        <option>Eau de Toilette</option>
        <option>Parfum</option>
        <option>Eau Fraiche</option>
        <option>Cologne</option>
      </select>
      <select name="genero" value={form.genero} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }}>
        <option>Unisex</option>
        <option>Femenino</option>
        <option>Masculino</option>
      </select>
      <input name="tamano" placeholder="Tamaño" value={form.tamano} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid var(--detail)' }} />
      <input name="imagen" type="file" accept="image/*" onChange={handleChange} style={{ marginBottom: 10 }} />
      {imgPreview && <img src={imgPreview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Guardando...' : 'Crear perfume'}</button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </form>
  );
}

export default CreatePerfume; 