const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const colors = require('colors');

// UncaughtException Error
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`.red.bold);
	process.exit(1);
});

// Connect to MongoDB Database
connectDatabase();

// Connect to Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to Localhost (4000)
const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`.green.bold)
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`.red.bold);
	server.close(() => {
		process.exit(1);
	});
});
