const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./models');
const perfumeRoutes = require('./routes/perfumeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware para proteger rutas
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.use('/api/admin', adminRoutes);
app.use('/api/admin/perfumes', authMiddleware, perfumeRoutes);
app.use('/api/perfumes', perfumeRoutes);

// Test de conexión y sincronización
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados');
  })
  .catch(err => {
    console.error('Error al conectar o sincronizar:', err);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
}); 