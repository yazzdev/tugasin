require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const { Board, Column, Card } = require('./models/associations');

const PORT = process.env.PORT || 3001;

// Test database connection and sync models
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
}

startServer();