import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../interface/post.interface';
import { URL_FOR_PHOTO } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  getPostById(id: string): Observable<Post> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Post>(url).pipe(
      map((post: Post) => {
        if (post.photos && post.photos.length > 0) {
          post.photos.forEach((photo) => {
            photo.src = this.getPhotoSrc(photo.url);
          });
        }
        return post;
      })
    );
  }

  getPhotoSrc(photo: any): string {
    return photo?.url ? URL_FOR_PHOTO + photo.url : '';
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  updatePost(id: string, post: Post): Observable<Post> {
    return this.http.patch<Post>(`${this.baseUrl}/${id}`, post);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  filterPosts(query: any): Observable<Post[]> {
    let params = new HttpParams();

    if (query.title) {
      params = params.set('title', query.title);
    }

    if (query.description) {
      params = params.set('description', query.description);
    }

    if (query.category) {
      params = params.set('category', query.category);
    }

    if (query.sortOrder) {
      params = params.set('sortOrder', query.sortOrder);
    }

    if (query.startDate && query.endDate) {
      params = params.set('startDate', query.startDate);
      params = params.set('endDate', query.endDate);
    }


    return this.http
      .get<Post[]>(`${this.baseUrl}`, { params })
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred while filtering posts:', error);
          return throwError('Something went wrong');
        })
      );
  }

  createPostWithPhoto(postData: any, files: File[]): Observable<Post> {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('category', postData.category);
    formData.append('date', postData.date.toISOString());

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    return this.http.post<Post>(this.baseUrl, formData);
  }

  uploadMultiplePhotos(postId: string, files: File[]): Observable<Post> {
    const formData = new FormData();
    formData.append('postId', postId);

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    return this.http.post<Post>(`${this.baseUrl}/${postId}/upload_photos`, formData);
  }
}
