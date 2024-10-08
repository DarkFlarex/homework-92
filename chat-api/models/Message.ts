import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;