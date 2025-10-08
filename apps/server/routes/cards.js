const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const validateBoard = require('../middleware/validateBoard');

router.get('/column/:columnId', validateBoard, cardController.getCards);
router.post('/', validateBoard, cardController.createCard);
router.put('/:id', validateBoard, cardController.updateCard);
router.delete('/:id', validateBoard, cardController.deleteCard);
router.put('/move/:id', validateBoard, cardController.moveCard);
router.put('/positions', validateBoard, cardController.updateCardPositions);

module.exports = router;