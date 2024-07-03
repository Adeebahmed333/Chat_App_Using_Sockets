const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }, 
    roomId:{
        type: String,
        required: true 
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;