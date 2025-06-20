const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { usuario } });
    if (!admin) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const token = jwt.sign({ id: admin.id, usuario: admin.usuario }, process.env.JWT_SECRET || 'secreto', { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 