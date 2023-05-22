import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Post } from '../interface/post.interface';
import { URL_FOR_PHOTO } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

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

  searchPosts(category: string): Observable<Post[]> {
    const params = { category };
    return this.http.get<Post[]>(`${this.baseUrl}/search/by`, { params });
  }

  sortByCreationDate(sortOrder: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/sort/by_creation_date?sortOrder=${sortOrder}`);
  }

  sortByDateRangePicker(startDate: Date, endDate: Date): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/sort/by_date_range_picker?startDate=${startDate}&endDate=${endDate}`);
  }

  // uploadMultiplePhotos(postId: string, files: File[]): Observable<Post> {
  //   const formData = new FormData();
  //   formData.append('postId', postId);
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('photos', files[i]);
  //   }
  //   return this.http.post<Post>(`${this.baseUrl}/${postId}/upload_photos`, formData);
  // }

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
