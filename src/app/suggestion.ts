export class Suggestion {
    id: number;
    title: string = '';
    likes: number = 0;
    liked: boolean = false;
    
    constructor(id, title, likes = 0) {
        this.title = title;
        this.likes = likes;
    }

    addLike() {
        this.likes++;
        this.liked = true;
    }
    removeLike() {
        this.likes--;
        this.liked = false;
    }
    getLikeStatus() {
        return this.liked;
    }
}
