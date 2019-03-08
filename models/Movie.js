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
    country: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    imdb_score: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    director_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('movie', MovieSchema);