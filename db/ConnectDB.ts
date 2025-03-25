import mongoose from 'mongoose';

/**
 * Function to connect to MongoDB database
 * @param {string} uri - MongoDB connection string
 * @returns {Promise<void>}
 */
const ConnectDB = async (uri: string): Promise<void> => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default ConnectDB;