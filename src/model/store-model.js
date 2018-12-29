const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slots: {
        type: Number,
        required: true
    },
    items: {
        type: Array,
        required: false
    },
    user: {
        type: String,
        required: true
    }
})

const StoreModel = mongoose.model('store', StoreSchema)

module.exports = StoreModel
