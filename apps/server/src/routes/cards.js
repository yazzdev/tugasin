const express = require('express');
const router = express.Router();
const prisma = require('../db/client');

// Create card
router.post('/', async (req, res) => {
  try {
    const { columnId, title, description, position, dueDate, completed } = req.body;

    if (!columnId || !title) {
      return res.status(400).json({ error: 'columnId and title are required' });
    }

    const cardData = {
      title,
      description: description || null,
      columnId,
      position: position !== undefined ? position : 0,
      completed: completed || false,
      dueDate: dueDate ? new Date(dueDate) : null
    };

    const card = await prisma.card.create({
      data: cardData
    });

    res.status(201).json({ card });
  } catch (error) {
    console.error('Error creating card:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid columnId' });
    }
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// Update card
router.put('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, dueDate, completed } = req.body;

    if (title === undefined && description === undefined && dueDate === undefined && completed === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData
    });

    res.json({ card });
  } catch (error) {
    console.error('Error updating card:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Update card position
router.patch('/:cardId/position', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { position, columnId } = req.body;

    if (position === undefined && columnId === undefined) {
      return res.status(400).json({ error: 'position or columnId must be provided' });
    }

    const updateData = {};
    if (position !== undefined) updateData.position = position;
    if (columnId !== undefined) updateData.columnId = columnId;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData
    });

    res.json({ card });
  } catch (error) {
    console.error('Error updating card position:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid columnId' });
    }
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Move card to different column
router.patch('/:cardId/move', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { newColumnId } = req.body;

    if (!newColumnId) {
      return res.status(400).json({ error: 'newColumnId is required' });
    }

    const updatedCard = await prisma.$transaction(async (tx) => {
      const cardToMove = await tx.card.findUnique({
        where: { id: cardId }
      });

      if (!cardToMove) {
        throw new Error('Card not found');
      }

      const maxPosition = await tx.card.aggregate({
        where: { columnId: newColumnId },
        _max: { position: true }
      });

      const targetPosition = maxPosition._max.position !== null ? maxPosition._max.position + 1 : 0;

      const updatedCard = await tx.card.update({
        where: { id: cardId },
        data: {
          columnId: newColumnId,
          position: targetPosition
        }
      });

      return updatedCard;
    });

    res.json({ card: updatedCard });
  } catch (error) {
    console.error('Error moving card:', error);
    if (error.message === 'Card not found') {
      return res.status(404).json({ error: 'Card not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid newColumnId' });
    }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

module.exports = router;