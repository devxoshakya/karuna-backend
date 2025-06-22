import mongoose from 'mongoose';

// Track connection state to avoid multiple connections
let isConnected = false;

/**
 * Function to connect to MongoDB database optimized for serverless environments
 * @param {string} uri - MongoDB connection string
 * @returns {Promise<void>}
 */
const ConnectDB = async (uri: string): Promise<void> => {
    // If already connected, return early
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        // Configure mongoose for serverless environments
        mongoose.set('bufferCommands', false);

        const connection = await mongoose.connect(uri, {
            maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false // Disable mongoose buffering
        });

        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        isConnected = false;
        throw error; // Don't exit process in serverless environment
    }
};

export default ConnectDB;