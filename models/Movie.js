const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    country: String,
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    imdb_score: Number,
    date: {
        type: Date,
        default: Date.now
    },
    director_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('movie', MovieSchema);