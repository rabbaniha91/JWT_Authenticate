const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToDB