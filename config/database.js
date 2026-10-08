const mongoose = require('mongoose');

let connectionPromise;

module.exports.connect = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URL).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  const connection = await connectionPromise;
  console.log("Connected to MongoDB");
  return connection;
}
