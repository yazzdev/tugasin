const express = require('express');
const router = express.Router();
const prisma = require('../db/client');

// Create column
router.post('/', async (req, res) => {
  try {
    const { boardId, title, position } = req.body;

    const column = await prisma.column.create({
      data: {
        title,
        boardId,
        position: position || 0
      }
    });

    res.status(201).json({ column });
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Failed to create column' });
  }
});

// Update column
router.put('/:columnId', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    const column = await prisma.column.update({
      where: { id: columnId },
      data: { title }
    });

    res.json({ column });
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
});

// Update column position
router.patch('/:columnId/position', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { position } = req.body;

    await prisma.column.update({
      where: { id: columnId },
      data: { position }
    });

    res.json({ message: 'Position updated' });
  } catch (error) {
    console.error('Error updating column position:', error);
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Delete column
router.delete('/:columnId', async (req, res) => {
  try {
    const { columnId } = req.params;

    await prisma.column.delete({
      where: { id: columnId }
    });

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
});

module.exports = router;