const colors = require('colors');
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI
// const MONGO_URI = "mongodb+srv://anas0501:anas0501@cluster0.8vp8p2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const connectDatabase = async () => {
	// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	// 	.then(() => {
	// 		console.log("Mongoose Connected");
	// 	})
	// 	.catch(error => {
	// 		console.error("Mongoose Connection Error:", error); // Add this line to log connection errors
	// });
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}` .green.bold);
	} catch (err) {
		console.error(err, red.bold);
	}
}

module.exports = connectDatabase;