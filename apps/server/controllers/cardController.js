const { Card } = require('../models/associations');
const { v4: uuidv4 } = require('uuid');

const cardController = {
  // Get cards for a column
  getCards: async (req, res) => {
    try {
      const cards = await Card.findAll({
        where: { columnId: req.params.columnId },
        order: [['position', 'ASC']]
      });

      res.json(cards);
    } catch (error) {
      console.error('Get cards error:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  },

  // Create card
  createCard: async (req, res) => {
    try {
      const { title, description, columnId } = req.body;

      // Get the position for the new card
      const existingCards = await Card.findAll({
        where: { columnId },
        order: [['position', 'DESC']],
        limit: 1
      });

      const newPosition = existingCards.length > 0
        ? existingCards[0].position + 1
        : 0;

      const card = await Card.create({
        id: uuidv4(),
        title,
        description,
        position: newPosition,
        columnId
      });

      res.status(201).json(card);
    } catch (error) {
      console.error('Create card error:', error);
      res.status(500).json({ error: 'Failed to create card' });
    }
  },

  // Update card
  updateCard: async (req, res) => {
    try {
      const [updated] = await Card.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedCard = await Card.findByPk(req.params.id);
        res.json(updatedCard);
      } else {
        res.status(404).json({ error: 'Card not found' });
      }
    } catch (error) {
      console.error('Update card error:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  },

  // Delete card
  deleteCard: async (req, res) => {
    try {
      const deleted = await Card.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.status(200).json({ message: 'Card deleted successfully' });
      } else {
        res.status(404).json({ error: 'Card not found' });
      }
    } catch (error) {
      console.error('Delete card error:', error);
      res.status(500).json({ error: 'Failed to delete card' });
    }
  },

  // Move card between columns
  moveCard: async (req, res) => {
    try {
      const { cardId, newColumnId, newPosition } = req.body;

      // Update card's column and position
      await Card.update(
        {
          columnId: newColumnId,
          position: newPosition
        },
        { where: { id: cardId } }
      );

      res.json({ message: 'Card moved successfully' });
    } catch (error) {
      console.error('Move card error:', error);
      res.status(500).json({ error: 'Failed to move card' });
    }
  },

  // Update card positions within a column
  updateCardPositions: async (req, res) => {
    try {
      const { cards } = req.body;

      for (const cardData of cards) {
        await Card.update(
          { position: cardData.position },
          { where: { id: cardData.id } }
        );
      }

      res.json({ message: 'Card positions updated' });
    } catch (error) {
      console.error('Update card positions error:', error);
      res.status(500).json({ error: 'Failed to update card positions' });
    }
  }
};

module.exports = cardController;