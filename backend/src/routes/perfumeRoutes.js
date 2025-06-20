const express = require('express');
const router = express.Router();
const perfumeController = require('../controllers/perfumeController');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Middleware de autenticación admin
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

// Endpoint protegido para subir imágenes
router.post('/upload', authMiddleware, upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

router.get('/', perfumeController.getPerfumes);
router.get('/:id', perfumeController.getPerfumeById);
router.post('/', perfumeController.createPerfume);
router.put('/:id', perfumeController.updatePerfume);
router.delete('/:id', perfumeController.deletePerfume);

module.exports = router; 