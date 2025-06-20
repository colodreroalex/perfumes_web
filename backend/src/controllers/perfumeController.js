const Perfume = require('../models/Perfume');

// Obtener todos los perfumes activos
exports.getPerfumes = async (req, res) => {
  try {
    const perfumes = await Perfume.findAll({ where: { activo: true }, order: [['fecha_creacion', 'DESC']] });
    res.json(perfumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un perfume por ID
exports.getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    if (!perfume) return res.status(404).json({ error: 'Perfume no encontrado' });
    res.json(perfume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo perfume
exports.createPerfume = async (req, res) => {
  try {
    const perfume = await Perfume.create(req.body);
    res.status(201).json(perfume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un perfume
exports.updatePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    if (!perfume) return res.status(404).json({ error: 'Perfume no encontrado' });
    await perfume.update(req.body);
    res.json(perfume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar (soft delete) un perfume
exports.deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    if (!perfume) return res.status(404).json({ error: 'Perfume no encontrado' });
    await perfume.update({ activo: false });
    res.json({ message: 'Perfume eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 