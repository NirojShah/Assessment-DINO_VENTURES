// server.ts (root)
import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import Database from './src/config/db';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database (handles creation + connection)
    await Database.initialize();
    
    // Make sequelize globally available for models
    (global as any).sequelize = Database.getInstance();

    // Start server
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
