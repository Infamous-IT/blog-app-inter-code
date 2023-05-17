import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interface/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl);
  }

  getCommentsByPostId(postId: string): Observable<Comment[]> {
    const url = `${this.baseUrl}/post/${postId}`;
    return this.http.get<Comment[]>(url);
  }

  getCommentById(id: string): Observable<Comment> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Comment>(url);
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment);
  }

  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.patch<Comment>(`${this.baseUrl}/${id}`, comment);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
