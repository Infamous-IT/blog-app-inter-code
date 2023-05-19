import {Post} from "./post.interface";

export interface Comment {
    _id: string;
    text: string;
    date: Date;
    post: Post;
}
