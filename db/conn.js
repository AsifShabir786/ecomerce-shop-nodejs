const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose
        .connect('mongodb+srv://malik:9NL74872tFav4pJG@cluster0.naha8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error('Not Connected'));
}

module.exports = connectDB;

