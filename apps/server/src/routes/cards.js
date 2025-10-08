const express = require('express');
const router = express.Router();
const prisma = require('../db/client');

// Create card
router.post('/', async (req, res) => {
  try {
    const { columnId, title, description, position, dueDate, completed } = req.body;

    // Validate required fields
    if (!columnId || !title) {
      return res.status(400).json({ error: 'columnId and title are required' });
    }

    // Get the highest position in the column to calculate the next position
    const maxPositionResult = await prisma.card.aggregate({
      where: { columnId },
      _max: { position: true }
    });

    const newPosition = (maxPositionResult._max.position || -1) + 1;

    const cardData = {
      title,
      description: description || null,
      columnId,
      position: position !== undefined ? position : newPosition,
      completed: completed || false
    };

    // Only add dueDate if it's provided and valid
    if (dueDate) {
      cardData.dueDate = new Date(dueDate);
    }

    const card = await prisma.card.create({
      data: cardData  // Fixed: Use 'data' property
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

    // Validate at least one field is provided
    if (title === undefined && description === undefined && dueDate === undefined && completed === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    // Handle dueDate separately to avoid invalid dates
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData  // Fixed: Use 'data' property
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
      data: updateData  // Fixed: Use 'data' property
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
    const { newColumnId, newPosition } = req.body;

    if (!newColumnId) {
      return res.status(400).json({ error: 'newColumnId is required' });
    }

    // Get the card to move
    const cardToMove = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!cardToMove) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Get all cards in the target column to reposition them
    const cardsInTargetColumn = await prisma.card.findMany({
      where: { columnId: newColumnId },
      orderBy: { position: 'asc' }
    });

    // If newPosition is provided, use it; otherwise, append to the end
    const finalPosition = newPosition !== undefined ? newPosition : cardsInTargetColumn.length;

    // Update the card's columnId and position
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        position: finalPosition
      }
    });

    res.json({ card: updatedCard });
  } catch (error) {
    console.error('Error moving card:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Card or column not found' });
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