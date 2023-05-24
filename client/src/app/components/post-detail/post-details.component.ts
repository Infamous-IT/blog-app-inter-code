import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, switchMap, throwError } from 'rxjs';

import { Post } from 'src/app/interface/post.interface';
import { Comment } from 'src/app/interface/comment.interface';
import { PostService } from 'src/app/service/post.service';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: Post;
  postId: string;
  comments: Comment[] = [];

  constructor(private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.postId = params.get('id');
          if (this.postId) {
            return this.loadPostDetails(this.postId);
          } else {
            return throwError('Post ID not found');
          }
        }),
        catchError(error => {
          console.error('Error fetching post details:', error);
          return throwError(error);
        })
      )
      .subscribe(({ post, comments }) => {
        this.post = post;
        this.comments = comments;
      });
  }

  loadPostDetails(postId: string): Observable<{ post: Post; comments: Comment[] }> {
    const post$ = this.postService.getPostById(postId);
    const comments$ = this.commentService.getCommentsByPostId(postId);

    return forkJoin([post$, comments$]).pipe(
      map(([post, comments]) => ({ post, comments }))
    );
  }

  isCommentForPost(comment: Comment): boolean {
    return comment && comment.post.id === this.post.id;
  }

  editPost(): void {
    this.router.navigate([`posts/update`, this.postId]);
  }

  deletePost(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.deletePost(postId).subscribe(
        () => {
          console.log('Post deleted successfully');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error deleting post:', error);
        }
      );
    }
  }

  getPhotoSrc(photo: any ): string {
    return this.postService.getPhotoSrc(photo);
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }
}
