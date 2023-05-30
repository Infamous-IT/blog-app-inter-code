import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../interface/comment.interface';
import { CommentService } from '../../service/comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() postId: string;
  comments: Comment[] = [];
  newCommentText: string;

  constructor(private commentService: CommentService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getCommentsByPostId(this.postId)
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  addComment(commentText: string) {
    if (commentText.trim() === '') {
      this.snackBar.open('Text cannot be empty!', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.commentService.createCommentForPost(this.postId, commentText)
      .subscribe(
        (comment: Comment) => {
          this.comments.push(comment);
          this.newCommentText = '';
        },
        (error: any) => {
          console.error('Помилка при створенні коментаря:', error);
        }
      );
  }
}
