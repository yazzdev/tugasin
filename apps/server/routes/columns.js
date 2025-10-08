const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');
const validateBoard = require('../middleware/validateBoard');

router.get('/board/:boardId', validateBoard, columnController.getColumns);
router.post('/', validateBoard, columnController.createColumn);
router.put('/:id', validateBoard, columnController.updateColumn);
router.delete('/:id', validateBoard, columnController.deleteColumn);
router.put('/positions', validateBoard, columnController.updateColumnPositions);

module.exports = router;