import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            minLength: 20
        },
        date: {
            type: Date,
            default: Date.now,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    },
    { timestamps: true }
);

export default mongoose.model("Comments", commentSchema);