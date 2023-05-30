import mongoose from "mongoose";
import { categories } from "./enum/categories.js";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            minLength: 5
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 5000
        },
        photos: [
            {
                url: {
                    type: String,
                },
                contentType: {
                    type: String,
                },
                path: {
                    type: String,
                },
            },
        ],
        category: {
            type: String,
            enum: Object.values(categories),
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
        }],
    },
    { timestamps: true }
);

export default mongoose.model("Posts", postSchema);