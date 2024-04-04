const colors = require('colors');
const mongoose = require('mongoose');

const connectDatabase = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}` .green.bold);
	} catch (err) {
		console.error(err, red.bold);
	}
}

module.exports = connectDatabase;