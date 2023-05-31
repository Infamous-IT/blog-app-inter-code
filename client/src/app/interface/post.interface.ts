export interface Post {
    id: string;
    title: string;
    description: string;
    photos: any[];
    category: string;
    date: Date;
    comments: { text: string, date: string }[];
}

