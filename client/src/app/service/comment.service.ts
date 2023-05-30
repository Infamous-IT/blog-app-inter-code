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

  createCommentForPost(postId: string, commentText: string): Observable<Comment> {
    const url = `${this.baseUrl}/${postId}`;
    const body = { text: commentText };
    return this.http.post<Comment>(url, body);
  }


  getCommentsByPostId(postId: string): Observable<Comment[]> {
    const url = `${this.baseUrl}/post/${postId}`;
    return this.http.get<Comment[]>(url);
  }

  getCommentById(id: string): Observable<Comment> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Comment>(url);
  }

  createComment(postId: string, text: string): Observable<Comment> {
    const body = { postId, text };
    return this.http.post<Comment>(this.baseUrl, body);
  }

  updateComment(id: string, text: string): Observable<Comment> {
    const body = { text };
    return this.http.patch<Comment>(`${this.baseUrl}/${id}`, body);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
