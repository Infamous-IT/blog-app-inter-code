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

  getPhotoSrc(photo: any): string {
    return this.postService.getPhotoSrc(photo);
  }
  
  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }
}