import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interface/post.interface';

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
    return this.http.get<Post>(url);
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

  searchPosts(query: any): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/search/by`, { params: query });
  }

  sortByCreationDate(sortOrder: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/sortByCreationDate?sortOrder=${sortOrder}`);
  }

  sortByDateRangePicker(startDate: Date, endDate: Date): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/sortByDateRangePicker?startDate=${startDate}&endDate=${endDate}`);
  }

  uploadMultiplePhotos(postId: string, files: File[]): Observable<Post> {
    const formData = new FormData();
    formData.append('postId', postId);
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    return this.http.post<Post>(`${this.baseUrl}/uploadMultiplePhotos`, formData);
  }

  getPhotoSrc(photos: any[]): string {
    if (photos && photos.length > 0) {
      const photo = photos[0];
      const base64Image = this.arrayBufferToBase64(photo.data.data);
      return 'data:' + photo.contentType + ';base64,' + base64Image;
    }
    return '';
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
