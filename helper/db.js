const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost/movie-api', { useNewUrlParser: true });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected!');
    });
    mongoose.connection.on('error', (error) => {
        console.log('MongoDB: Connection Failed! \n', error);
    });
}