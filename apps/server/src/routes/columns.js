const express = require('express');
const router = express.Router();
const prisma = require('../db/client');

// Create column
router.post('/', async (req, res) => {
  try {
    const { boardId, title, position } = req.body;

    // Validate required fields
    if (!boardId || !title) {
      return res.status(400).json({ error: 'boardId and title are required' });
    }

    const column = await prisma.column.create({
      data: {
        title,
        boardId,
        position: position !== undefined ? position : 0
      }
    });

    res.status(201).json({ column });
  } catch (error) {
    console.error('Error creating column:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid boardId' });
    }
    res.status(500).json({ error: 'Failed to create column' });
  }
});

// Update column
router.put('/:columnId', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const column = await prisma.column.update({
      where: { id: columnId },
      data: { title }
    });

    res.json({ column });
  } catch (error) {
    console.error('Error updating column:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.status(500).json({ error: 'Failed to update column' });
  }
});

// Update column position
router.patch('/:columnId/position', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { position } = req.body;

    if (position === undefined) {
      return res.status(400).json({ error: 'position is required' });
    }

    const column = await prisma.column.update({
      where: { id: columnId },
      data: { position }
    });

    res.json({ column });
  } catch (error) {
    console.error('Error updating column position:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Column not found' });
    }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.status(500).json({ error: 'Failed to delete column' });
  }
});

module.exports = router;