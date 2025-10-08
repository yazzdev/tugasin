const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const validateBoard = require('../middleware/validateBoard');

router.post('/', boardController.createBoard);
router.get('/:id', validateBoard, boardController.getBoard);
router.put('/:id', validateBoard, boardController.updateBoard);
router.delete('/:id', validateBoard, boardController.deleteBoard);

module.exports = router;