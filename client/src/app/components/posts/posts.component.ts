import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts$: Observable<Post[]>;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit():void {
    this.posts$ = this.getPosts();
  }

  getPosts(): Observable<Post[]> {
    if (!this.posts$) {
      this.posts$ = this.postService.getPosts().pipe(distinctUntilChanged());
    }
    return this.posts$;
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

  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }
}