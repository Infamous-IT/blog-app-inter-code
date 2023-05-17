export interface Post {
    id: string;
    title: string;
    description: string;
    photos: string[];
    category: string;
    date: Date;
    comments: string[];
}