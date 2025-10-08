const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Board } = require('../models/associations');
const { BOARD_EXPIRY_DAYS } = require('../../../shared/constants');

async function cleanupExpiredBoards() {
  try {
    console.log('Starting board cleanup...');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - BOARD_EXPIRY_DAYS);

    const deletedCount = await Board.destroy({
      where: {
        lastActiveAt: { [Op.lt]: cutoffDate }
      },
      hooks: true // Ensure cascade deletion works
    });

    console.log(`Cleaned up ${deletedCount} expired boards`);
    process.exit(0);
  } catch (error) {
    console.error('Board cleanup error:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupExpiredBoards();