const express = require('express');
const router = express.Router();
const prisma = require('../db/client');

// Create card
router.post('/', async (req, res) => {
  try {
    const { columnId, title, description, position } = req.body;

    const card = await prisma.card.create({
      data: {
        title,
        description,
        columnId,
        position: position || 0
      }
    });

    res.status(201).json({ card });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// Update card
router.put('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description } = req.body;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: { title, description }
    });

    res.json({ card });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Update card position
router.patch('/:cardId/position', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { position, columnId } = req.body;

    await prisma.card.update({
      where: { id: cardId },
      data: { position, columnId }
    });

    res.json({ message: 'Position updated' });
  } catch (error) {
    console.error('Error updating card position:', error);
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Move card to different column
router.patch('/:cardId/move', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { newColumnId, newPosition } = req.body;

    await prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        position: newPosition
      }
    });

    res.json({ message: 'Card moved successfully' });
  } catch (error) {
    console.error('Error moving card:', error);
    res.status(500).json({ error: 'Failed to move card' });
  }
});

// Delete card
router.delete('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;

    await prisma.card.delete({
      where: { id: cardId }
    });

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

module.exports = router;