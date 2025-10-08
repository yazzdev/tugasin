const prisma = require('../db/client');

async function cleanupExpiredBoards() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // 7 days ago

    const deleted = await prisma.board.deleteMany({
      where: {
        lastActiveAt: {
          lt: cutoffDate
        }
      }
    });

    console.log(`Deleted ${deleted.count} expired boards.`);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error cleaning up expired boards:', error);
    process.exit(1);
  }
}

cleanupExpiredBoards().catch(e => {
  console.error(e);
  process.exit(1);
});