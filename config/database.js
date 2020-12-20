const mongoose = require('mongoose')
const config = require('config')
const databaseLink = config.get('mongoURI')

const connectDB = async () => {
  //any kind of connection need try-catch
  try {
    await mongoose.connect(databaseLink, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected...');
  } catch (error) {
    console.log(error.message);
    process.exit(1); //fail -> exit the process
  }
}

module.exports = connectDB;